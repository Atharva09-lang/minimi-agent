
import { tavily } from "@tavily/core";

const client = tavily();

const MAX_RESULTS = 8;

const OFFICIAL_SOURCES = {
  salesforce: {
    domain: "salesforce.com",
    hint: "Salesforce CRM official pricing Free Suite Starter Suite Pro Suite Core",
    keywords: ["salesforce", "sales cloud"]
  },
  zoho: {
    domain: "zoho.com",
    hint: "Zoho CRM official edition pricing Standard Professional Enterprise Ultimate",
    keywords: ["zoho"]
  },
  hubspot: {
    domain: "hubspot.com",
    hint: "HubSpot CRM official pricing plans",
    keywords: ["hubspot"]
  },
  pipedrive: {
    domain: "pipedrive.com",
    hint: "Pipedrive official pricing plans",
    keywords: ["pipedrive"]
  },
  freshworks: {
    domain: "freshworks.com",
    hint: "Freshsales official CRM pricing plans",
    keywords: ["freshworks", "freshsales"]
  },
  neon: {
    domain: "neon.tech",
    hint: "Neon official PostgreSQL hosting pricing plans",
    keywords: ["neon"]
  },
  supabase: {
    domain: "supabase.com",
    hint: "Supabase official PostgreSQL database pricing plans",
    keywords: ["supabase"]
  },
  render: {
    domain: "render.com",
    hint: "Render official PostgreSQL database pricing",
    keywords: ["render"]
  },
  railway: {
    domain: "railway.com",
    hint: "Railway official PostgreSQL hosting pricing",
    keywords: ["railway"]
  }
};

function getMatchedSources(query) {
  const text = query.toLowerCase();

  return Object.entries(OFFICIAL_SOURCES)
    .filter(([brand]) => {
      if (brand === "freshworks") {
        return /\bfreshworks\b|\bfreshsales\b/i.test(text);
      }

      return new RegExp(`\\b${brand}\\b`, "i").test(text);
    })
    .map(([brand, source]) => ({
      brand,
      ...source
    }));
}

function isNewsQuery(query) {
  return /\b(news|latest news|breaking|announced|announcement|shipped|launched|launch|release|released|product update|recent update)\b/i.test(query);
}

function needsAdvancedSearch(query) {
  return /\b(pricing|price|cost|comparison|compare|changed|changes|documentation|official|plan|subscription)\b/i.test(query);
}

function getSearchOptions(query, domains, maxResults = MAX_RESULTS) {
  return {
    topic: isNewsQuery(query) ? "news" : "general",
    searchDepth: needsAdvancedSearch(query) ? "advanced" : "basic",
    maxResults,
    ...(domains?.length > 0 && {
      includeDomains: domains
    })
  };
}

function isValidUrl(value) {
  try {
    const url = new URL(value);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
}

function getDomain(url) {
  try {
    return new URL(url).hostname
      .toLowerCase()
      .replace(/^www\./, "");
  } catch {
    return "";
  }
}

function isOfficialSource(url, officialDomains) {
  const hostname = getDomain(url);

  return officialDomains.some(
    (domain) =>
      hostname === domain ||
      hostname.endsWith(`.${domain}`)
  );
}

function normalizeResults(items, officialDomains, brand = null) {
  return (items || [])
    .filter((item) => isValidUrl(item.url))
    .map((item) => ({
      title: item.title || "Untitled",
      url: item.url,
      domain: getDomain(item.url),
      content: (item.content || "").slice(0, 1200),
      score: item.score ?? null,
      publishedDate: item.publishedDate || null,
      isOfficial: isOfficialSource(item.url, officialDomains),
      matchedBrand: brand
    }));
}

function isRelevantToBrand(item, source) {
  const text = `${item.title} ${item.content}`.toLowerCase();

  return source.keywords.some((keyword) =>
    text.includes(keyword)
  );
}

function deduplicateResults(results) {
  const seen = new Set();

  return results.filter((item) => {
    const normalizedUrl = item.url
      .replace(/\/+$/, "")
      .toLowerCase();

    if (seen.has(normalizedUrl)) {
      return false;
    }

    seen.add(normalizedUrl);
    return true;
  });
}

function sortResults(results) {
  return [...results].sort((a, b) => {
    if (a.isOfficial !== b.isOfficial) {
      return a.isOfficial ? -1 : 1;
    }

    return (b.score ?? 0) - (a.score ?? 0);
  });
}

//interleave vendor results without globally re-sorting them afterward.
function balanceResults(groups, limit) {
  const output = [];
  const seen = new Set();
  let index = 0;

  while (output.length < limit) {
    let added = false;

    for (const group of groups) {
      const item = group[index];

      if (!item) continue;

      const normalizedUrl = item.url
        .replace(/\/+$/, "")
        .toLowerCase();

      if (seen.has(normalizedUrl)) continue;

      seen.add(normalizedUrl);
      output.push(item);
      added = true;

      if (output.length >= limit) break;
    }

    if (!added && groups.every((group) => !group[index])) {
      break;
    }

    index++;
  }

  return output;
}

async function searchSource(query, source, limit) {
  const searchQuery = `${query} ${source.hint}`;

  //first search the official vendor domain.
  const officialResponse = await client.search(
    searchQuery,
    getSearchOptions(searchQuery, [source.domain], limit)
  );

  let results = normalizeResults(
    officialResponse.results,
    [source.domain],
    source.brand
  ).filter((item) => item.isOfficial);

  //search more broadly only when official results are insufficient.
  if (results.length < limit) {
    const fallbackResponse = await client.search(
      searchQuery,
      getSearchOptions(searchQuery, undefined, limit)
    );

    const fallbackResults = normalizeResults(
      fallbackResponse.results,
      [source.domain],
      source.brand
    ).filter((item) =>
      item.isOfficial || isRelevantToBrand(item, source)
    );

    results = deduplicateResults([
      ...results,
      ...fallbackResults
    ]);
  }

  results = sortResults(results).slice(0, limit);

  console.log(
    `[Web Search] ${source.brand}: ${results.length} relevant results, ` +
    `${results.filter((item) => item.isOfficial).length} official`
  );

  return results;
}

export async function searchWeb(query) {
  if (typeof query !== "string" || !query.trim()) {
    throw new Error("A valid search query is required.");
  }

  const cleanedQuery = query.trim();

  if (cleanedQuery.length > 400) {
    throw new Error("Search query must be 400 characters or fewer.");
  }

  try {
    const matchedSources = getMatchedSources(cleanedQuery);
    let results = [];

    if (matchedSources.length > 0) {
      const perSourceLimit = Math.ceil(
        MAX_RESULTS / matchedSources.length
      );

      const responses = await Promise.all(
        matchedSources.map((source) =>
          searchSource(cleanedQuery, source, perSourceLimit)
        )
      );

      //keep each matched vendor represented in the final evidence.
      results = balanceResults(responses, MAX_RESULTS);

      //general fallback only when all vendor searches return nothing.
      if (results.length === 0) {
        const fallback = await client.search(
          cleanedQuery,
          getSearchOptions(cleanedQuery)
        );

        results = normalizeResults(fallback.results, []);
      }
    } else {
      const response = await client.search(
        cleanedQuery,
        getSearchOptions(cleanedQuery)
      );

      results = sortResults(
        normalizeResults(response.results, [])
      ).slice(0, MAX_RESULTS);
    }

    //do not globally sort balanced vendor results here.
    results = results.slice(0, MAX_RESULTS);

    console.log("[Web Search] Query:", cleanedQuery);
    console.log(
      "[Web Search] Matched vendors:",
      matchedSources.map((source) => source.brand)
    );

    console.log(`[Web Search] Total results: ${results.length}`);

    return {
      query: cleanedQuery,
      results,
      sources: results.map((item) => ({
        title: item.title,
        url: item.url,
        domain: item.domain,
        publishedDate: item.publishedDate,
        isOfficial: item.isOfficial,
        matchedBrand: item.matchedBrand
      }))
    };
  } catch (error) {
    console.error("Web search error:", error.message);

    throw new Error(
      "Web search failed. Please try again."
    );
  }
}

import { findByName } from "@vendetta/metro";
import { after } from "@vendetta/patcher";

const bunny = window.bunny.api.react.jsx

const cache = new Map<number, number>();
const REFRESH_INTERVAL = 1000 * 60 * 30;

const badgeModule = findByName("useBadges", false);
const badgeCache = {
  "hyleus-badge-core": {
    id: "hyleus-badge-core",
    source: {
      uri: "https://alfuwu.github.io/Images/new%20hyleus%20hc%20shadowed.png"
    },
    label: "core of hyleus"
  },
  "hyleus-badge-pillar": {
    id: "hyleus-badge-pillar",
    source: {
      uri: "https://alfuwu.github.io/Images/new%20hyleus%20hc%20shadowed.png"
    },
    label: "pillar of hyleus"
  },
  "hyleus-badge-normal": {
    id: "hyleus-badge-normal",
    source: {
      uri: "https://alfuwu.github.io/Images/new%20hyleus%20hc%20shadowed.png"
    },
    label: "part of hyleus"
  },
  "hyleus-badge-fringe": {
    id: "hyleus-badge-fringe",
    source: {
      uri: "https://alfuwu.github.io/Images/new%20hyleus%20hc%20shadowed.png"
    },
    label: "servant of hyleus"
  }
};

let unpatch: () => void;
export default {
  onLoad: () => {
    populateCache();

    bunny.onJsxCreate("ProfileBadge", (component, ret) => {
      if (ret.props.id?.startswith("hyleus-")) {
        const badgePropsCache = badgeCache[ret.props.id];
        if (badgePropsCache) {
          ret.props.source = badgePropsCache.source;
          ret.props.label = badgePropsCache.label;
          ret.props.id = badgePropsCache.id;
        }
      }
    })

    bunny.onJsxCreate("RenderBadge", (component, ret) => {
      if (ret.props.id?.startsWith("hyleus-")) {
        const badgePropsCache = badgeCache[ret.props.id];
        if (badgePropsCache) {
          Object.assign(ret.props, badgePropsCache);
        }
      }
    })

    unpatch = after("default", badgeModule, ([user], result) => {
      if (user === null) return;

      const pushBadges = (badge) => {
        result.push(badge);
      };

      if (cache.has(user.userId)) {
        const num = cache.get(user.userId);
        const desc = num < 0 ? "core of hyleus" : num == 0 ? "pillar of hyleus" : num >= 3 ? "servant of hyleus" : "part of hyleus";
        console.log(`Adding Hyleus badge to ${user.username}`);
        const badgeId = `hyleus-badge-${num < 0 ? "core" : num == 1 ? "pillar" : num >= 3 ? "fringe" : "part"}`;
        pushBadges({
          id: badgeId,
          description: desc,
          icon: "dummy",
        });
      }
    });
  },
  onUnload: () => {
    unpatch?.();
  },
};

async function populateCache() {
  const res = await fetch(
    `https://alfuwu.github.io/Images/hyleusians.json`
  );
  const body = await res.json();
  Object.entries(body).forEach(([userId, val]: [string, number]) => {
    cache.set(parseInt(userId), val);
  });
}
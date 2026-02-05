import { apiFetch } from "../api/api";

export function useAuction() {

  /* =======================
     SELLER / ITEM ACTIONS
     ======================= */

  const createAuctionItem = async (payload) => {
    return apiFetch("/items", "POST", payload);
  };

  const getMyAuctionItems = async () => {
    return apiFetch("/items/my");
  };

  const getAvailableItems = async () => {
    return apiFetch("/items/available");
  };

  const getClaimedItems = async () => {
    return apiFetch("/items/my/claimed");
  };

  const claimItem = async (itemId) => {
    return apiFetch(`/items/${itemId}/claim`, "POST");
  };

  const scheduleAuctionItem = async (itemId, payload) => {
    return apiFetch(`/items/${itemId}/schedule`, "POST", payload);
  };

  /* =======================
     AUCTION (NEW SYSTEM)
     ======================= */

  // ✅ Create auction (this replaces publishAuction)
  const createAuction = async (payload) => {
    return apiFetch("/auctions", "POST", payload);
  };

  // ✅ Home page (public)
  const getUpcomingAuctions = async () => {
    return apiFetch("/auctions/upcoming");
  };

  // ✅ Host dashboard
  const getHostUpcomingAuctions = async () => {
    return apiFetch("/auctions/my/upcoming");
  };

  const startAuction = async (auctionId) => {
    return apiFetch(`/auctions/${auctionId}/start`, "POST");
  };

  /* =======================
     REGISTRATION / USER
     ======================= */

  const registerForAuction = async (auctionId) => {
    return apiFetch(`/auctions/${auctionId}/register`, "POST");
  };

  const getMyRegistrations = async () => {
    return apiFetch("/items/my/registrations");
  };

  const getMyWins = async () => {
    return apiFetch("/auctions/my/wins");
  };

  return {
    // items
    createAuctionItem,
    getMyAuctionItems,
    getAvailableItems,
    claimItem,
    getClaimedItems,
    scheduleAuctionItem,

    // auctions
    createAuction,
    getUpcomingAuctions,
    getHostUpcomingAuctions,
    startAuction,

    // user
    registerForAuction,
    getMyRegistrations,
    getMyWins,
  };
}

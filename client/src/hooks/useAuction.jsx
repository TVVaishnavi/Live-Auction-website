import { apiFetch } from "../api/api";

export function useAuction() {

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

  const unclaimItem = async (id) => {
    await apiFetch(`/items/${id}/unclaim`, "PATCH");
  };

  const scheduleAuctionItem = async (itemId, payload) => {
    return apiFetch(`/items/${itemId}/schedule`, "POST", payload);
  };

  const createAuction = async (payload) => {
    return apiFetch("/auctions", "POST", payload);
  };


  const getUpcomingAuctions = async () => {
    return apiFetch("/auctions/upcoming");
  };


  const getHostUpcomingAuctions = async () => {
    return apiFetch("/auctions/my/upcoming");
  };

  const startAuction = async (auctionId) => {
    return apiFetch(`/auctions/${auctionId}/start`, "POST");
  };



  const registerForAuction = async (auctionId) => {
    return apiFetch(`/auctions/${auctionId}/register`, "POST");
  };

  const getMyRegistrations = async () => {
    return apiFetch("/items/my/registrations");
  };

  const getMyWins = async () => {
    return apiFetch("/items/my/wins");
  };


  const completeAuctionItem = async (auctionId, payload) => {
    return apiFetch(`/auctions/${auctionId}/complete-item`, "POST", payload);
  };

  const getAuctionById = async (auctionId) => {
    return apiFetch(`/auctions/${auctionId}`);
  };

  const getMyPreviousAuctions = () => {
    return apiFetch("/items/my/previous");
  }

  const finalizeItem = (itemId, payload) =>
    apiFetch(`/items/${itemId}/finalize`, "POST", payload);

  const isRegistered = async (auctionId) => {
    return apiFetch(`/items/auctions/${auctionId}/is-registered`, "GET");
  }

  return {
    createAuctionItem,
    getMyAuctionItems,
    getAvailableItems,
    claimItem,
    unclaimItem,
    getClaimedItems,
    scheduleAuctionItem,

    createAuction,
    getUpcomingAuctions,
    getHostUpcomingAuctions,
    startAuction,
    getMyPreviousAuctions,

    registerForAuction,
    getMyRegistrations,
    getMyWins,
    completeAuctionItem,
    getAuctionById,
    finalizeItem,
    isRegistered,
  };
}

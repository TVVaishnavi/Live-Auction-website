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

    const finalizeAuctionItem = async (itemId, payload) => {
        return apiFetch(`/items/${itemId}/finalize`, "PUT", payload);
    };

    const scheduleAuction = async (itemId, payload) => {
        return apiFetch(
            `/items/${itemId}/schedule`,
            "POST",
            payload
        );
    };

    const publishAuction = async (itemId) => {
        return apiFetch(
            `/items/${itemId}/publish`,
            "POST"
        );
    };


    const getPublishedAuctions = async () => {
        return apiFetch("/items/published");
    };

    const registerForAuction = async (auctionKey) => {
        return apiFetch(
            `/items/${encodeURIComponent(auctionKey)}/register`,
            "POST"
        );
    };



    const getMyRegistrations = async () => {
        return apiFetch("/items/my/registrations");
    };

    const getMyWins = async () => {
        return apiFetch("/items/my/wins");
    };

    const getMyHostedAuctions = async () => {
        return apiFetch("/items/my/hosted");
    };

    const getHostAuctionRegistrations = async (liveTitle, startTime) => {
        return apiFetch(
            `/items/host/auction/registrations?liveTitle=${encodeURIComponent(
                liveTitle
            )}&startTime=${encodeURIComponent(startTime)}`
        );
    };
    const isRegisteredForAuction = async (auctionKey) => {
        return apiFetch(
            `/items/${encodeURIComponent(auctionKey)}/is-registered`
        );
    };

    const getHostUpcomingAuctions = async () => {
        return apiFetch("/items/my/upcoming");
    };

    const getHostPreviousAuctions = async () => {
        return apiFetch("/items/my/previous");
    };

    const startAuction = async (auctionKey) => {
        return apiFetch(
            `/items/${encodeURIComponent(auctionKey)}/start`,
            "POST"
        );
    };



    return {
        createAuctionItem,
        getMyAuctionItems,
        getAvailableItems,
        claimItem,
        getClaimedItems,
        scheduleAuction,
        publishAuction,
        getPublishedAuctions,
        registerForAuction,
        getMyRegistrations,
        getMyWins,
        getMyHostedAuctions,
        finalizeAuctionItem,
        getHostAuctionRegistrations,
        isRegisteredForAuction,
        getHostUpcomingAuctions,
        getHostPreviousAuctions,
        startAuction,
    };
}

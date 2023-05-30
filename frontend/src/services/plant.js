import http from "../http-common";

class PlantDataService {
    getAll(userId, page = 0) {
        return http.get(`/user/${userId}/plant?page=${page}`);
    }

    get(plantId) {
        return http.get(`/plant/${plantId}`);
    }

    find(userId, query, by = "nickname", page = 0) {
        return http.get(`/user/${userId}/plant?${by}=${query}&page=${page}`);
    }

    filterSearch(userId, filter, page = 0) {
        let url = `/user/${userId}/plant?`;
        let andFlag = false;
        for (const key in filter) {
            if (filter[key]) {
                if (andFlag) {
                    url += `&${key}=${filter[[key]]}`;
                } else {
                    url += `${key}=${filter[[key]]}`;
                    andFlag = true;
                }
            }
        }
        url += andFlag ? `&page=${page}` : `page=${page}`;
        console.log(url);
        return http.get(url);
    }

    createPlant(userId, data) {
        return http.post(`/user/${userId}/plant`, data);
    }

    updatePlant(userId, plantId, data) {
        return http.patch(`/user/${userId}/plant?id=${plantId}`, data);
    }

    deletePlant(userId, plantId) {
        return http.delete(`/user/${userId}/plant?id=${plantId}`);
    }

    getLocations(userId) {
        return http.get(`/user/${userId}/locations`);
    }
}

const plantDataService = new PlantDataService();
export default plantDataService;

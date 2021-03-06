import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "https://localhost:3001";

/** API Class
 * Static class tying together methods used to get/send to the API
 * 
 */

class JoblyAPI {
    static token;

    static async request(endpoint, data = {}, method = "get") {
        const url = `${BASE_URL}/${endpoint}`;
        const headers = { Authorization: `Bearer ${JoblyAPI.token}`};
        const params = (method === "get")
            ? data
            : {};
        
        try {
            return (await axios({ url, method, data, params, headers})).data;
        } catch (err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }
    // Individual API Routes


    static async getCurrentUser(username) {
        let res = await this.request(`users/${username}`);
        return res.user;
    }

    static async getCompanies(name) {
        let res = await this.request("companies", { name });
        return res.companies;
    }

    /** Get details on a company by handle */

    static async getCompany(handle) {
        let res = await this.request(`companies/${handle}`);
        return res.company;
    }

    static async getJobs(title) {
        let res = await this.request("jobs", { title });
        return res.jobs;
    }

    static async applyToJob(username, id) {
        await this.request(`users/${username}/jobs/${id}`, {}, "post");
    }

    static async login(data) {
        let res = await this.request(`auth/token`, data, "post");
        return res.token;
    }

    static async signup(data) {
        let res = await this.request(`auth/register`, data, "post");
        return res.token;
    }

    static async saveProfile(username, data) {
        let res = await this.request(`users/${username}`, data, "patch");
        return res.user;
    }
}

export default JoblyAPI;
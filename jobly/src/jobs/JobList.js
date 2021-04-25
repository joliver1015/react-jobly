import React, { useState, useEffect } from "react";
import Search from "../common/SearchForm";
import JoblyApi from "../api/api";
import JobCardList from "./JobCardList";

const JobList = () => {
    console.debug("JobList");

    const [jobs, setJobs] = useState(null);

    useEffect(function getAllJobsOnMount() {
        console.debug("JobList useEffect getAllJobsOnMount");
        search();
    }, []);

    async function search(title) {
        let jobs = await JoblyApi.getJobs(title);
        setJobs(jobs);
    }

    return (
        <div className="JobList col-md-8 offset-md-2">
            <Search searchFor={search} />
            {jobs.length
                ? <JobCardList jobs={jobs} />
                : <p className="lead">No results found</p>
            }
        </div>
    );
}

export default JobList;
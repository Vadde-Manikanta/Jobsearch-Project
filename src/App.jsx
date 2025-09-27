import React, { useState } from 'react';

const App = () => {
  const [jobQuery, setJobQuery] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // NOTE: It's highly recommended to move API keys to a .env file
  // and not expose them directly in the frontend code.
  const API_KEY = '5a3dee3d00mshf3a860964c2316dp14a7b8jsnf82a5d352890';
  const API_HOST = 'jsearch.p.rapidapi.com';

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!jobQuery || !jobLocation) return;

    setHasSearched(true);
    setLoading(true);
    setError('');
    setJobs([]);

    const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(jobQuery)}%20in%20${encodeURIComponent(jobLocation)}&page=1&num_pages=20`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST
      }
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText} (Status: ${response.status})`);
      }
      const result = await response.json();
      setJobs(result.data || []);
    } catch (err) {
      setError(`Failed to fetch jobs. ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const JobCard = ({ job }) => {
    const companyLogo = job.employer_logo ? (
      <img src={job.employer_logo} alt={`${job.employer_name} logo`} className="w-14 h-14 rounded-lg object-contain mr-4 bg-slate-100 p-1" />
    ) : (
      <div className="w-14 h-14 rounded-lg mr-4 bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xl">
        {job.employer_name ? job.employer_name.charAt(0) : '?'}
      </div>
    );

    const location = [job.job_city, job.job_state, job.job_country].filter(Boolean).join(', ');

    return (
      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out border-l-4 border-transparent hover:border-indigo-500">
        <div className="flex items-start">
          {companyLogo}
          <div className="flex-grow">
            <h2 className="text-xl font-bold text-slate-800">{job.job_title}</h2>
            <p className="text-slate-600 font-medium">{job.employer_name}</p>
            <p className="text-slate-500 text-sm mt-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {location || 'Remote'}
            </p>
          </div>
          <a
            href={job.job_apply_link}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 self-center whitespace-nowrap bg-indigo-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-indigo-700 transition-colors text-sm shadow-sm hover:shadow-md transform hover:scale-105"
          >
            Apply
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-indigo-100 text-slate-800 min-h-screen font-sans">
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 pb-2">
            Find Your Next Job
          </h1>
          <p className="text-slate-600 mt-2 text-lg">Enter your desired role and location to start the search.</p>
        </header>

        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg mb-10 border border-slate-200">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-2">
              <label htmlFor="job-query" className="block text-sm font-medium text-slate-700 mb-1">
                Job Title / Keyword
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 3.75A2.25 2.25 0 018.25 6h3.5A2.25 2.25 0 0114 8.25v3.5A2.25 2.25 0 0111.75 14h-3.5A2.25 2.25 0 016 11.75v-3.5A2.25 2.25 0 016 6V3.75zM3.75 6A2.25 2.25 0 016 3.75h8.25A2.25 2.25 0 0116.5 6v8.25A2.25 2.25 0 0114.25 16.5H6A2.25 2.25 0 013.75 14.25V6z" clipRule="evenodd" />
                </svg>
                <input
                  type="text"
                  id="job-query"
                  value={jobQuery}
                  onChange={(e) => setJobQuery(e.target.value)}
                  placeholder="Software Engineer"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  required
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="job-location" className="block text-sm font-medium text-slate-700 mb-1">
                Location
              </label>
               <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <input
                  type="text"
                  id="job-location"
                  value={jobLocation}
                  onChange={(e) => setJobLocation(e.target.value)}
                  placeholder="Chicago, US"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="md:col-span-1 w-full bg-indigo-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg transform active:scale-95"
            >
              {loading ? '...' : 'Search'}
            </button>
          </form>
        </div>

        {loading && (
          <div className="text-center my-12">
            <svg className="animate-spin h-10 w-10 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="mt-3 text-slate-600 text-lg">Finding amazing jobs...</p>
          </div>
        )}

        {error && (
            <div className="text-center my-12 bg-red-100 border border-red-300 text-red-700 px-4 py-5 rounded-lg">
                <p className="font-bold">Oops! Something went wrong.</p>
                <p className="text-sm mt-1">{error}</p>
            </div>
        )}
        
        <main id="results-container" className="grid grid-cols-1 gap-6">
          {jobs.map((job) => <JobCard key={job.job_id} job={job} />)}
        </main>

        {!loading && jobs.length === 0 && !error && hasSearched && (
            <div className="text-center my-12 p-8 bg-white/60 rounded-xl shadow-md border">
                <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-slate-800">No Jobs Found</h3>
                <p className="mt-1 text-slate-500">We couldn't find any jobs matching your search. Try using different keywords or a broader location.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default App;

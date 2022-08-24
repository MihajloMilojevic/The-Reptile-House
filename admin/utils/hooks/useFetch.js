import { useState, useEffect, useCallback } from "react";

const useFetch = (url) => {
	const [data, setData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [options, setOptions] = useState({});
	const doFetch = useCallback((options = {}) => {
		setOptions(options);
		setIsLoading(true);
	}, []);

	useEffect(() => {
		if (!isLoading) {
			return;
		}

		const fetchData = async () => {
			try {
				const res = await fetch(url, options);
				const data = await res.json();
				setData(data);
			} catch (err) {
				setError(err);
			}
			setIsLoading(false);
		};
		
		fetchData();
	}, [isLoading, options, url]);

	return [{ data, error, isLoading }, doFetch];
};

export default useFetch;
export const serviceOptions={
  method: 'GET',
	hostname: 'exercisedb.p.rapidapi.com',
	port: null,
	path: '/exercises/bodyPartList',
	headers: {
		'x-rapidapi-key': process.env.REACT_APP_RAPID_API_KEY,
		'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
	}
	}

export const fetchData=async(url,options)=>{
const response=await fetch(url,options); //we want to fetch the url and provide the additional options
const data=await response.json();
return data;
}
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import AutocompleteInput from './components/AutocompleteInput';
import CitiesAccordion from './components/CitiesAccordion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const countries = [
  { id: 1, code: "PL", name: "Poland" },
  { id: 2, code: "ES", name: "Spain" },
  { id: 3, code: "DE", name: "German" },
  { id: 4, code: "FR", name: "France" }
];

const parameter = "pm10";
const resultsLimit = 100;

const getLocalData = (key) => {
  let localData = localStorage.getItem(key);
  return localData ? JSON.parse(localData) : [];
}

function App() {
  const [country, setCountry] = useState(getLocalData('country'));
  const [cities, setCities] = useState(getLocalData('cities'));
  const [isLoading, setIsLoading] = useState(false);
  const firstFetch = useRef(true);

  const handleError = (error) => {
    toast.error(error.message,
      {
        autoClose: 5000,
        hideProgressBar: true,
      });
  }

  const getData = callbackCountry => {
    try {
      if (callbackCountry) {
        const filteredCountry = countries.filter(country => country.name.toLowerCase() === callbackCountry.toLowerCase());

        if (filteredCountry.length) {
          localStorage.setItem('country', JSON.stringify(filteredCountry));
          setCountry(filteredCountry);
        }
        else
          throw new Error("No such country in browser");
      } else {
        throw new Error("To check air quality You need to type in country name");
      }
    } catch (error) {
      handleError(error);
    }
  }

  useEffect(() => {
    if (firstFetch.current) {
      firstFetch.current = false;
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      const response = await axios.get(`https://api.openaq.org/v1/measurements?country=${country[0].code}&parameter=${parameter}&order_by=value&sort=desc&limit=${resultsLimit}&format=json`);
      setIsLoading(false);

      if (!response.error) {
        let { results } = response.data;
        results = getUniqueCities(results, "city");
        localStorage.setItem('cities', JSON.stringify(results));
        setCities(results);
      }
      else
        handleError(response);
    }

    fetchData();
  }, [country]);

  const getUniqueCities = (cities, parameter) => {
    return cities
      .map(city => city[parameter])
      .map((city, i, final) => final.indexOf(city) === i && i)
      .filter(city => cities[city])
      .map(city => cities[city])
      .slice(0, 10);
  }

  return (
    <div className="container">
      <header>
        <h1 className="text-center m-5">Check air quality in Your country</h1>
      </header>
      <section>
        <AutocompleteInput
          country={country ? country[0].name : ""}
          countries={countries}
          handleSubmit={getData}
        />
      </section>
      <ToastContainer />
      {isLoading ? <h5>Loading...</h5> :
        <section>
          <CitiesAccordion cities={cities} />
        </section>}
      <footer>
        <div className="footer offset-md-2 col-md-8">
          <h5>Always care about Your lungs! Every breath is a essence of life</h5>
        </div>
      </footer>
    </div>
  );
}

export default App;
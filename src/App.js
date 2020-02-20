import React, { useRef, useState, useEffect } from 'react';
import { withCookies, useCookies } from "react-cookie";
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

function App() {
  console.log("Render App")
  const [{ country }, setCountry] = useCookies(["country"]);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const firstFetch = useRef(true);

  const getData = callbackCountry => {
    if (callbackCountry) {
      console.log("Firing getData() with: ", callbackCountry);
      setCountry("country", countries.filter(country => country.name.toLowerCase() === callbackCountry.toLowerCase()));
    } else {
      toast.error("To check air quality You need to type in country name",
        {
          autoClose: 5000,
          hideProgressBar: true,
        });
    }
  }

  useEffect(() => {
    if (firstFetch.current) {
      firstFetch.current = false;
      return;
    }

    const fetchData = async () => {
      console.log(country[0].code);
      setIsLoading(true);
      const response = await axios.get(`https://api.openaq.org/v1/measurements?country=${country[0].code}&parameter=${parameter}&order_by=value&sort=desc&limit=${resultsLimit}&format=json`
      );

      if (!response.error) {
        let { results } = response.data;
        results = getUniqueCities(results, "city");
        setCities(results);
        setIsLoading(false);
      }
      else {
        setIsLoading(false);
        toast.error(response.message, {
          autoClose: 5000,
          hideProgressBar: true,
        });
      }
    }

    console.log("Firing fetch");
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
      {isLoading ? "Loading..." :
        <section>
          <CitiesAccordion cities={cities} />
        </section>}
      {/* footer></footer> */}
    </div>
  );
}

export default withCookies(App);

// class App extends React.Component {
//   state = {
//     country: "",
//     parameter: "",
//     limit_results: null,
//     cities: [],
//     suggestions: []
//   }

//   componentDidMount() {
//     this.setState({
//       parameter: getPollutionParameter(),
//       limit_results: getSearchLimit(),
//       cities: getCitiesFromCookies(this.props),
//       country: getCountryFromCookies(this.props),
//       suggestions: getSuggestions()
//     })
//   }

//   setCountry = (suggestions, userInput) => {
//     const { cookies } = this.props;

//     for (let suggestion of suggestions) {
//       if (suggestion.name === userInput) {
//         cookies.set("country", suggestion.name, { path: "/" })
//         return suggestion.code;
//       }
//     }
//     return "XYZ";
//   }

//   getUniqueCities = (cities, parameter) => {
//     return cities
//       .map(city => city[parameter])
//       .map((city, i, final) => final.indexOf(city) === i && i)
//       .filter(city => cities[city])
//       .map(city => cities[city])
//       .slice(0, 10);
//   }

//   onSubmit = async (event, userInput) => {
//     event.preventDefault();
//     const { parameter, limit_results, suggestions } = this.state;
//     const { cookies } = this.props;

//     await this.setState({ country: this.setCountry(suggestions, userInput), cities: [] });

//     const url = `https://api.openaq.org/v1/measurements?country=${this.state.country}&parameter=${parameter}&order_by=value&sort=desc&limit=${limit_results}&format=json`;
//     let response = await fetch(url);
//     response = await response.json();

//     if (!response.error) {
//       let { results } = response;
//       results = results.map(result => {
//         return {
//           city: result.city,
//           location: result.location,
//           parameter: result.parameter,
//           value: Math.round(result.value * 100) / 100,
//           unit: result.unit
//         };
//       });

//       results = this.getUniqueCities(results, "city");
//       cookies.set("pollutedCities", results, { path: "/" });
//       this.setState({ cities: results });
//     }
//     else {
//       toast.error(response.message, {
//         autoClose: 5000,
//         hideProgressBar: true,
//       });
//     }
//   }

//   render() {
//     const { cities, suggestions } = this.state
//     return (
//       <div className="container">
//         <header>
//           <h1 className="text-center">Check air quality in Your country</h1>
//         </header>
//         <section>
//           <AutocompleteInput
//             suggestions={suggestions}
//             onSubmit={this.onSubmit}
//           />
//           <ToastContainer />
//         </section>
//         <section>
//           <CitiesAccordion cities={cities} />
//         </section>
//         <footer></footer>
//       </div>
//     );
//   }
// }


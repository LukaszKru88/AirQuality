import React from 'react';
import AutocompleteInput from './components/AutocompleteInput'
import './App.css';

class App extends React.Component {
  state = {
    country: "",
    parameter: "",
    limit_results: 0,
    date: null,
    cities: [],
    suggestions: []
  }

  componentDidMount() {
    this.setState({
      parameter: "so2",
      limit_results: 100,
      date: this.getCurrentDate(),
      suggestions: [
        { name: "Poland", code: "PL" },
        { name: "Germany", code: "DE" },
        { name: "France", code: "FR" },
        { name: "Spain", code: "ES" }]
    })
  }

  getCurrentDate = () => {
    const date = new Date();
    const hh = date.getUTCHours() - 1; //-1h because measurement delay on page
    const dd = date.getDate();
    const mm = date.getMonth() + 1; //Returns 0 for January
    const yyyy = date.getFullYear();

    return `${yyyy}-${mm < 10 ? "0" + mm : mm}-${dd < 10 ? "0" + dd : dd}T${hh < 10 ? "0" + hh : hh}:00:00`
  }

  onChange = ({ currentTarget: input }) => {
    const { name, value } = input;
    this.setState({ [name]: value });
  }

  setCountry = (suggestions, userInput) => {
    for (let suggestion of suggestions) {
      if (suggestion.name === userInput)
        return suggestion.code;
    }
    return "XYZ";
  }

  getUniqueCities = (cities, parameter) => {
    return cities
      .map(city => city[parameter])
      .map((city, i, final) => final.indexOf(city) === i && i)
      .filter(city => cities[city])
      .map(city => cities[city])
      .slice(0, 10);
  }

  onSubmit = async (event, userInput) => {
    event.preventDefault();
    const { parameter, limit_results, date, suggestions } = this.state

    await this.setState({ country: this.setCountry(suggestions, userInput) })

    const url = `https://api.openaq.org/v1/measurements?country=${this.state.country}&parameter=${parameter}&order_by=value&sort=desc&limit=${limit_results}&date_from=${date}&date_to=${date}&format=json`

    let response = await fetch(url);
    response = await response.json();
    console.log(url)
    if (!response.error) {
      let { results } = response;
      results = results.map(result => {
        return {
          city: result.city,
          location: result.location,
          parameter: result.parameter,
          value: result.value,
          unit: result.unit
        };
      });

      results = this.getUniqueCities(results, "city")
      this.setState({ cities: results });
    }
    else {
      console.log(response.message)
    }
  }

  render() {
    const { cities, suggestions } = this.state
    return (
      <div className="container">
        <header>
          <h1 className="text-center">Check air quality in Your country</h1>
        </header>
        <AutocompleteInput
          suggestions={suggestions}
          onSubmit={this.onSubmit}
        />
        <section>
          <div className="row">
            {cities && <table className="citiesTable offset-md-1 col-md-10">
              {cities.length === 0 ?
                <div className="text-center text-uppercase"><p>No data to view here</p></div> :
                <thead className="text-uppercase">
                  <tr>
                    <th>City</th>
                    <th>Parameter</th>
                    <th>Value</th>
                    <th>Unit</th>
                  </tr>
                </thead>}
              <tbody>
                {cities.map((city, index) => (
                  <tr key={index}>
                    <td>{city.city}</td>
                    <td>{city.parameter}</td>
                    <td>{city.value}</td>
                    <td>{city.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>}
          </div>
        </section>
        <footer></footer>
      </div>
    );
  }
}

export default App;

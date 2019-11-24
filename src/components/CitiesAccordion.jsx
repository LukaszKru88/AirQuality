import React, { Component } from 'react';
import { Accordion, Card } from "react-bootstrap";

class CitiesAccordion extends Component {
    state = {
        url: "https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&limit=1&namespace=0&format=json&search=",
        cityDescription: ""
    }

    onClick = async (city) => {
        const { url } = this.state;

        let response = await fetch(url + city);
        response = await response.json();

        this.setState({ cityDescription: response[2] });
    }

    render() {
        const { cities } = this.props;
        const { cityDescription } = this.state;

        return (
            <div className="row">
                {cities && cities.length > 0 ?
                    <React.Fragment>
                        <Accordion className="offset-3 col-6">
                            <h5>List of 10 most polluted cities in selected country :</h5>
                            {cities.map((city, index) => (
                                <Card key={index}>
                                    <Accordion.Toggle
                                        as={Card.Header}
                                        eventKey={index}
                                        onClick={() => this.onClick(city.city)}
                                    >
                                        {<div>
                                            <div className="float-left">{city.city}</div><div className="float-right">{`PM10: ${city.value} ${city.unit}`}</div>
                                        </div>}
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey={index}>
                                        <Card.Body>
                                            {cityDescription[0] === "" ? `No data found about ${city.city} on Wikipedia` : cityDescription}
                                        </Card.Body>
                                    </Accordion.Collapse>

                                </Card>
                            ))}
                        </Accordion>
                    </React.Fragment> :
                    ((cities && cities.length === 0) ? <h5 className="offset-3 col-6"><p>No data to view here</p></h5> : null)}
            </div>);
    }
}

export default CitiesAccordion;
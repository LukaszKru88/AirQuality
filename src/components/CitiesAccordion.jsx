import React, { Component } from 'react';
import { Accordion, Card } from "react-bootstrap";

class CitiesAccordion extends Component {
    state = {
        url: "https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&limit=1&namespace=0&format=json&search=",
        cityDescription: ""
    }

    onClick = async ({ currentTarget: input }) => {
        const { url } = this.state
        const { innerText: city } = input
        let response = await fetch(url + city);
        response = await response.json();
        console.log(response[2])
        this.setState({ cityDescription: response[2] });
    }

    render() {
        const { cities } = this.props;
        const { cityDescription } = this.state;

        return (
            <div className="row">
                {cities && cities.length > 0 &&
                    <React.Fragment>
                        <Accordion className="offset-3 col-6">
                            <h5>List of 10 most polluted cities in selected country :</h5>
                            {cities.map((city, index) => (
                                <Card key={index}>
                                    <Accordion.Toggle
                                        as={Card.Header}
                                        eventKey={index}
                                        onClick={this.onClick}
                                    >
                                        {city.city}
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey={index}>
                                        <Card.Body>{cityDescription}</Card.Body>
                                    </Accordion.Collapse>

                                </Card>
                            ))}
                        </Accordion>
                    </React.Fragment>}
            </div>);
    }
}

export default CitiesAccordion;
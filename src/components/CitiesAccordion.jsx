import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Accordion, Card } from "react-bootstrap";


const CitiesAccordion = ({ cities }) => {
    const [cityDescription, setCityDescription] = useState("");
    const [city, setCity] = useState("");

    const handleClick = (city) => {
        setCity(city);
    }

    useEffect(() => {
        const fetchDesctiption = async () => {
            let response = await axios.get(`https://en.wikipedia.org/w/api.php?format=json&origin=*&action=opensearch&limit=1&namespace=0&format=json&search=${city}`);
            setCityDescription(response.data[3]);
        }

        if (city.length)
            fetchDesctiption()
    }, [city])

    return (
        <div className="row">
            {cities && cities.length ?
                <React.Fragment>
                    <Accordion className="offset-md-2 col-md-8">
                        <h5>List of 10 most polluted cities in selected country :</h5>
                        {cities.map(city => (
                            < Card key={city.location} >
                                <Accordion.Toggle
                                    as={Card.Header}
                                    eventKey={city}
                                    onClick={() => handleClick(city.city)}
                                >
                                    {<div className="accordion">
                                        <div className="float-left">{city.city}</div><div className="float-right">{`PM10: ${city.value} ${city.unit}`}</div>
                                    </div>}
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey={city}>
                                    <Card.Body>
                                        {cityDescription[0] === "" ? `No data found about ${city.city} on Wikipedia` :
                                            <React.Fragment>
                                                <span>More information about {city.city} under the link: </span>
                                                <a href={cityDescription} target="_blank">{cityDescription}</a>
                                            </React.Fragment>}
                                    </Card.Body>
                                </Accordion.Collapse>

                            </Card>
                        ))}
                    </Accordion>
                </React.Fragment> :
                (cities.length ? <h5 className="offset-3 col-6"><p>No data to view here</p></h5> : null)
            }
        </div >
    );
}

export default React.memo(CitiesAccordion);
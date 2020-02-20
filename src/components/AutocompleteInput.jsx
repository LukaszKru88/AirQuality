import React, { useState, useEffect } from 'react';

const AutocompleteInput = ({ country, countries, handleSubmit }) => {
    const [input, setInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isVisible, setVisible] = useState(false);
    const [activeSuggestion, setActiveSuggestion] = useState(0);

    const handleChange = event => {
        setInput(event.target.value);
        setVisible(true);
        setActiveSuggestion(0);
        if (event.target.value.length === 0)
            setVisible(false);
    };

    const handleSubmitButton = () => {
        setVisible(false);
        handleSubmit(input);
    }

    const handleSuggestionClick = event => {
        setInput(event.target.innerHTML);
        setVisible(false);
    }

    const handleKeyDown = event => {
        if (event.key === "ArrowDown") {
            if (activeSuggestion === suggestions.length - 1)
                return;
            setActiveSuggestion(activeSuggestion + 1);
        }
        else if (event.key === "ArrowUp") {
            if (activeSuggestion === 0)
                return
            setActiveSuggestion(activeSuggestion - 1);
        }
        else if (event.key === "Enter") {
            if (suggestions.length > 0)
                setInput(suggestions[activeSuggestion].name);
            else
                setInput(event.target.value);

            setActiveSuggestion(0);
            setVisible(false);
        }
    }

    useEffect(() => {
        console.log("Firing componenetDidMount");
        if (country) setInput(country);
    }, []);

    useEffect(() => {
        if (input.length > 0) {
            setSuggestions(countries.filter(country => country.name.toLowerCase().indexOf(input.toLowerCase()) > -1));
        }
    }, [input, countries]);

    let suggestionListComponent = (
        suggestions.map((suggestion, index) => {

            let className;
            if (index === activeSuggestion)
                className = "suggestion-active";

            return <li className={className} key={suggestion.id} onClick={handleSuggestionClick}>{suggestion.name}</li>;
        })
    );

    return (
        <div className="row justify-content-center">
            <div className="col-md-8">
                <div className="input-group">
                    <input name="country" type="text" className="form-control" placeholder="country..." value={input} onChange={handleChange} onKeyDown={handleKeyDown} required />
                    <div className="input-group-append">
                        <button onClick={handleSubmitButton} className="btn btn-primary" type="button">Take a breath</button>
                    </div>
                </div>
                <ul className="suggestions">
                    {isVisible && suggestionListComponent}
                </ul>
            </div>
        </div>
    );
}

export default React.memo(AutocompleteInput);

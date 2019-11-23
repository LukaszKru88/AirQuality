import React, { Component } from 'react';
import { withCookies } from "react-cookie";
import PropTypes from "prop-types";

class AutocompleteInput extends Component {
    state = {
        activeSuggestion: 0,
        userInput: "",
        filteredSuggestions: [],
        showSuggestions: false
    }

    static propTypes = {
        suggestions: PropTypes.instanceOf(Array)
    };

    static defaultProps = {
        suggestions: []
    };

    componentDidMount() {
        const { cookies } = this.props
        if (cookies.get("country")) {
            this.setState({ userInput: cookies.get("country") })
        }
    }

    onChange = ({ currentTarget: input }) => {
        const { suggestions } = this.props;
        const filteredSuggestions = suggestions.filter(
            suggestion =>
                suggestion.name.toLowerCase().indexOf(input.value.toLowerCase()) > -1
        );

        this.setState({
            activeSuggestion: 0,
            userInput: input.value,
            filteredSuggestions,
            showSuggestions: true
        })
    }

    onClick = ({ currentTarget: input }) => {
        this.setState({
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: input.innerText
        });
    }

    // onKeyDown = e => {
    //     const { activeSuggestion, filteredSuggestions } = this.state;

    //     if (e.keyCode === 13) {
    //         this.setState({
    //             activeSuggestion: 0,
    //             showSuggestions: false,
    //             userInput: filteredSuggestions[activeSuggestion]
    //         });
    //     }

    //     else if (e.keyCode === 38) {
    //         if (activeSuggestion === 0) {
    //             return;
    //         }

    //         this.setState({ activeSuggestion: activeSuggestion - 1 });
    //     }

    //     else if (e.keyCode === 40) {
    //         if (activeSuggestion - 1 === filteredSuggestions.length) {
    //             return;
    //         }

    //         this.setState({ activeSuggestion: activeSuggestion + 1 });
    //     }
    // };

    render() {
        const { userInput, filteredSuggestions, showSuggestions } = this.state;
        let suggestionsList;

        if (userInput && showSuggestions) {
            if (filteredSuggestions.length) {
                suggestionsList = (
                    <div className="row">
                        <ul className="suggestions offset-lg-3 col-lg-6">
                            {filteredSuggestions.map((suggestion, index) => {
                                return (
                                    <li key={index} onClick={this.onClick}>
                                        {suggestion.name}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )
            } else {
                suggestionsList = (
                    <div className="text-center offset-lg-3 col-lg-6">
                        <em>No suggestions</em>
                    </div>
                );
            }
        }

        return (
            <React.Fragment>
                <div className="row">
                    <form className="countryForm offset-lg-3 col-lg-6" onSubmit={(event) => this.props.onSubmit(event, userInput)}>
                        <div className="input-group">
                            <input name="country" className="form-control" id="country" type="text" placeholder="Country..." onChange={this.onChange} onKeyDown={this.onKeyDown} value={userInput} required />
                            <div className="input-group-append"><input className="btn btn-info text-uppercase" type="submit" value="Take a breath" /></div>
                        </div>
                    </form>
                </div>
                {suggestionsList}
            </React.Fragment>
        );
    }
}

export default withCookies(AutocompleteInput);
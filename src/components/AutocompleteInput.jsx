import React, { Component } from 'react';
import PropTypes from "prop-types";
// import Autocomplete from 'react-autocomplete';

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
                            <input name="country" className="form-control" id="country" type="text" placeholder="Country..." onChange={this.onChange} onKeyDown={this.onKeyDown} value={userInput} />
                            <div className="input-group-append"><input className="btn btn-info text-uppercase" type="submit" value="Take a breath" /></div>
                        </div>
                    </form>
                </div>
                {suggestionsList}
            </React.Fragment>
        );
    }
}

export default AutocompleteInput;

// class AutocompleteInput extends Component {
//     state = { value: '' };

//     getCountry = () => {
//         return [{ name: "Poland", code: "PL" },
//         { name: "Germany", code: "DE" }, { name: "France", code: "FR" }, { name: "Spain", code: "ES" }
//         ]
//     }

//     matchCountry = (state, value) => {
//         console.log(state);
//         console.log(value);
//         return (
//             state.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
//             state.code.toLowerCase().indexOf(value.toLowerCase()) !== -1
//         );
//     }

//     render() {
//         return (
//             <div className="card col-sm-6" style={{ marginTop: 40, marginLeft: 50 }}>
//                 <div class="card-header">
//                     Country Name :
//       </div>
//                 <div class="card-body">
//                     <form>
//                         <div className="form-group">

//                             <Autocomplete
//                                 value={this.state.value}
//                                 inputProps={{ id: 'states-autocomplete' }}
//                                 wrapperStyle={{ position: 'relative', display: 'inline-block' }}
//                                 items={this.getCountry()}
//                                 getItemValue={item => item.name}
//                                 shouldItemRender={this.matchCountry}
//                                 onChange={(event, value) => this.setState({ value })}
//                                 onSelect={value => this.setState({ value })}
//                                 renderMenu={children => (
//                                     <div className="menu">
//                                         {children}
//                                     </div>
//                                 )}
//                                 renderItem={(item, isHighlighted) => (
//                                     <div
//                                         className={`item ${isHighlighted ? 'item-highlighted' : ''}`}
//                                         key={item.abbr} >
//                                         {item.name}
//                                     </div>
//                                 )}
//                             />
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         );
//     }
// }

// export default AutocompleteInput;
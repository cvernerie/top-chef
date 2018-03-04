import React, { Component } from "react";

const apiUrl = "http://localhost:8080/lafourchette-deals"

class Starred extends Component {
    constructor(props) {
        super(props);

        this.state = {
            restaurants: [],
        };
    }

    componentDidMount() {
        fetch(apiUrl, { accept: 'application/json' })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    restaurants: data,
                })
            });
    }

    render() {
        const { restaurants } = this.state;
        return (
            <div>
                <h2>Starred restaurants</h2>
                <p>We found { restaurants.length } restaurants for you</p>
                <ul>
                    {restaurants.map(rest =>
                        <li key={rest._id}>
                            <h3>{rest.name}</h3>
                            <ul>
                                {rest.deals.map(deal =>
                                    <li key={deal.id}>
                                        <h4> {deal.title} </h4>
                                        <p> {deal.exclusions} </p>
                                    </li>
                                )}
                            </ul>
                        </li>
                    )}
                </ul>
            </div>
        );
    }
}

export default Starred;

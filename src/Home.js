import React, { Component } from "react";

const apiUrl = "http://localhost:8080/lafourchette-deals"

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            restaurants: [],
            restaurantsWithDeals: []
        };
    }

    componentDidMount() {
        fetch(apiUrl, { accept: 'application/json' })
            .then(response => response.json())
            .then(data => {
                var restaurantsWithDeals = []
                for (var i = 0; i < data.length; i++) {
                    if (data[i].deals.length > 0) {
                        restaurantsWithDeals.push(data[i])
                    }
                }
                this.setState({
                    restaurants: data,
                    restaurantsWithDeals: restaurantsWithDeals
                })
            });
    }

    render() {
        const { restaurants } = this.state;
        const { restaurantsWithDeals } = this.state;
        return (
            <div>
                <h2>Deals</h2>
                <p>We found { restaurants.length } restaurants for you, and {restaurantsWithDeals.length} of them has at least one deal !</p>
                <ul>
                    {restaurantsWithDeals.map(rest =>
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

export default Home;

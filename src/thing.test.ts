import {test} from "@jest/globals";
import {createAuthLink} from "aws-appsync-auth-link";
import {createSubscriptionHandshakeLink} from "aws-appsync-subscription-link";
import 'cross-fetch/polyfill';
import {
    gql,
    ApolloClient,
    InMemoryCache,
    HttpLink,
    ApolloLink,
} from "@apollo/client/core";
import {Subscription} from "rxjs";

Object.assign(global, {WebSocket: require('ws')});

const url = "http://localhost:20002/graphql";
const region = "us-east-2"
const httpLink = new HttpLink({uri: url});

const link = ApolloLink.from([
    createAuthLink({
        url, region, auth: {
            type: "API_KEY",
            apiKey: "da2-fakeApiId123456",
        }
    }),
    createSubscriptionHandshakeLink({
        url, region, auth: {
            type: "API_KEY",
            apiKey: "da2-fakeApiId123456",
        }
    }, httpLink),
]);

const apolloClient = new ApolloClient({
    link,
    cache: new InMemoryCache(),
});

test("do a thing", async () => {
    let subscription: Subscription;
    await new Promise((resolve) => {
        const observable = apolloClient.subscribe({
            query: gql`subscription MySubscription {    onAddBook {  title }  }`,
        })

        let count = 0
        subscription = observable.subscribe((result) => {
            console.log("result", result)
            count++
            if (count === 3) {
                resolve()
            }
        });
    })
    subscription.unsubscribe()

}, 30000)
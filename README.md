> [!IMPORTANT]  
> Work in progress

<!-- PROJECT LOGO -->
<br />
<div align="center">
    <img src="./public/images/cardano_logo.png" alt="Logo" width="320" height="65">
</div>

## Built With

Major frameworks/libraries used in this project.

[![ReactJS][ReactJS]][ReactJS-url] [![Axios][Axios]][Axios-url]
[![Tailwindcss][Tailwindcss]][Tailwindcss-url] [![BlueprintJS][BlueprintJS]][BlueprintJS-url] [![Node][Node.js]][Node-url]
[![Cardano][Cardano]][Cardano-url]

# Cardano Reward Calculator
This is a web interface where
users can enter an ADA balance and calculate their potential rewards
based on current blockchain parameters and a representative staking pool.

## Using a single page React App
We chose the single page React App as it is the siplest form to launch a web project and is well understood
in the developer's community. It is simple, but lacks many features, which can be complemented with
more complete frameworks, such as NextJS. Transposing the code from this ReactJS repo into a NextJS is straight
forward.

### Install and Run
Clone the repo, install npm packaged and start a local development environment

```shell
git clone https://github.com/dynamicstrategies/cardano-reward-calculator.git
cd cardano-reward-calculator
npm install
npm start
```

This will launch a rewards calculator on <a href="http://localhost:3000">http://localhost:3000</a>


## Using the NextJS framework
As an alternative to ReactJS 
We give an example of how to deploy this code in using NextJS in a separate folder `/nextjs` .
There most of the calculations are reused and NextJS specific boilerplate code added

...

### CORS issues
When developing on local computer and connecting to external APIs (such as Koios), 
the web browser may stop you from making those requests as a security measure.

Run this in a separate terminal to avoid issues with CORS when running in a local environment.

#### Install local-cors-proxy

```shell
npm install -g local-cors-proxy
```

#### Run a local cors proxy

```shell
lcp --proxyUrl https://api.koios.rest/api/v1 --port 7070
```

This will launch a local proxy server on `http://localhost:7070/proxy` which will reroute all the API requests to Koios.
So the code you will need to make requests to the localhost




## Description
The application provides options for more
detailed calculations, including expandable sections that explain the
reward calculation formula, how various blockchain parameters influence
rewards, and the role of stake pools in the process.

The reward calculator is organized in 4 sections with increasing detail:

**1. Basic Calculator** Displays the calculator and allow the user to
   input values to determine the expected % annual yield and
   expected ADA return over a year

**2. Stake Pools** Specify up to 3 staking pool
tickets to replace the representative pool in the first section. By
adding the staking pool tickets the calculator then shows the
expected return for these pools.

**3. Stake Pool Parameters** Show the parameters of the selected stake
pools and let the user change these parameters. The front-end will
then show how the rewards are expected to change with the new
parameters for the stake pools (e.g. minimum pool cost, margin,
stake and pledge).

**4. Blockchain Parameters** Show the static blockchain parameters
(which can not be changed e.g. total supply of ADA) and the
dynamic parameters (that can be changed through a governance
vote and/or CIP e.g. the k and the a0 parameters). The user is
able to change the dynamic parameters in the front-end and the
calculator recalculate the new rewards for the
pools selected in the previous sections. The purpose of this section is to
inform the users of how blockchain parameters can impact the
rewards.


### Algorithm
The algorithm and the calculations of the rewards are
performed in the front-end application and relies on
publicly available information. The front-end connects to a back-end
service to retrieve the current blockchain state and stake pool information.


### Limitations
The implementation favors usability and efficiency and does not conform to the strict 
implementation standards of the Cardano code.
The implementation is done primarily in JavaScript using the ReactJS front-end
framework. Javascript is not a high numeric precision language and
therefore rounding errors can occur during computation. This is considered
to be an acceptable trade-off as the main goal of the application is to
inform users of the future expected rewards from staking and how these
change if blockchain or stake pool parameters are amended rather than a
precise calculation of historic rewards.


<!-- MARKDOWN LINKS & IMAGES -->
[Tailwindcss]: https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white
[Tailwindcss-url]: https://tailwindcss.com/
[Axios]: https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white
[Axios-url]: https://axios-http.com/
[ReactJS]: https://img.shields.io/badge/react-5A29E4?style=for-the-badge&logo=react&logoColor=white
[ReactJS-url]: https://react.dev/
[Node.js]: https://img.shields.io/badge/nodedotjs-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
[Cardano]: https://img.shields.io/badge/cardano-0133AD?style=for-the-badge&logo=cardano&logoColor=white
[Cardano-url]: https://cardano.org/
[BlueprintJS]: https://img.shields.io/badge/blueprint-137CBD?style=for-the-badge&logo=blueprint&logoColor=white
[BlueprintJS-url]: https://blueprintjs.com/

# Setup instructions

1. git clone this repo into your local machine, the repo contains both the front and back end technical test. `git clone https://github.com/geengene/14_Exabloom_Technical_Test.git`
2. `cd` into `/frontend/exabloom-react-flow`
3. run `npm i` to install dependencies
4. run `npm run dev` to start frontend and access it on localhost:5173

## Assumptions

1. assuming for if/else node, if creates a branch with existing "children" nodes(existing nodes below the if/else node), and else will create a new branch/path with the else node + end node.
2. assumed that deleting a branch only deletes the branch node itself and not its child nodes
3. assume I am allowed to style my custom nodes my way and there was no need for Icons, like in the example provided

## Challenges

1. setting up custom add edge button's logic
2. making node positions dynamic so that nodes/edges don't overlap each other esp for if-else node
3. passing data to Form

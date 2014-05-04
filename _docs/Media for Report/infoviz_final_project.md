#Infoviz final project

# Design goals
- Content over controls:
- We wanted to show the BART ridership data and have the user interact with it and play with it from the moment they launched it. Our ridership data has three dimensions and we wanted to figure out a way to allow the user to play around with it without having to go through drop downs and clicking buttons.

- One questions approach: We drew inspiration from Raymon's and Shreyas's visualization and process. We decided early on that our visualization should have deep focus. We had a test for this. Can we communicate the question in **one line**.
	
- BART station coordinates are generated automatically by a script that takes the coordinates of Daly City and West Oakland as input.
- We modeled the BART as a undirected graph with cycles and generated directed trees from that once a source station has been selected. This helped us perform math to aggregate the data so that we can show case the flow.
- How to show case ridership? Flow of the commuters like water is the answer.


- Why small multiples? Three ways to show case the time data: tooltip, slider or small multiples

- Why the map? 
- Why brushing?
- We added the water body as a defining shape to help identify the location of the BART stations and help the user place them in their head.
- For our design we have a grid that every thing fits into: Its 4 dots at the four corners of a square 


- IDEAs
	- presentation mode: that has links to interesting observation
	- lines for stations
	
	
- is there some one at the iSchool who can advice us on fast prototyping

# Marti Feedback
- Small multiples is confusing because it is not small multiples of the same visualization
 - Presentation mode: 
	- also why: like are there seasonal trends
	- is there something interesting during the game season
- using colors to show case the regional flow
- bart car shaped bars in the map viz
- **log** of values
- Pricing data
- use animation to show the number of users dropping out at each station
In the first semester of my second year at university I was tasked with developing a program to control a door keycard entry system for a university in Java.


This is the given specification:

> “You have been approached by a local university and asked to design and implement a software system for controlling access to rooms on the university campus. Access to each room on each floor of each campus building is controlled via a swipe card system. All staff and students are permanently issued swipe cards appropriate to their role at the university while visitors are issued with a visitor card upon arrival at reception. Each room can be configured to admit a user based on the roles assigned to their swipe card and the type of room the user is trying to access. In addition certain roles may only allow access to a room at certain times.
>
> In addition to the swipe card systems normal operations, and to support health and safety requirements, it should be possible to place a room, building or the entire campus into an “emergency mode”. Each campus building has a supply of ‘emergency responder’ cards that can be accessed by fire, police and medical personnel. In “normal mode” these cards cannot be used to access any room. When in “emergency mode” these cards should allow access to ANY room.”

The focus of the module was to develop the the system while following good software development practices, with this in mind my end product follows the SOLID design principles and utilises the following design patterns:

- Model-view-controller
- Observer
- State
- Factory
- Singleton

The data model behind the system was developed to be as expandable as possible, this is what the state patterns are for; the system has 5 different types of keycard, 5 different types of room, and 2 different room states but more of all 3 can be added with very minimal modification to the current code. All it takes is to add a class file containing the logic for the object being added and to include it into a couple of switch-cases.

As well as storing locations, keycards, and how they interact with each other, the designed system also records the interactions between the objects in log files, as well as automatically saving archived states of the data model. The program can then load in the archived states into a read-only mode so the user can analyse any ongoing emergencies. Log files can also be searched through to find actions evolving specific people, locations, times, or any other details.
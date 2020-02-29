This project is a fully configurable solar system simulator with accurate gravity without using a physics engine as a dependency.

Based off of my [3D Model loader](https://tobysmith.uk/university/year3/model-loader), this simulator allows the user to configure a sun and any number of planets to orbit it. When the user starts up the application and enables physics, they can see how their configured solar system would run. It is written in **C/C++** and uses **OpenGL** to render the 3D models.

The system is accurate as far as I can test - the configuration file for the planets uses kilograms and metres. The physics calculations also take delta-time into consideration to ensure that the planets move in real time.

The system also has two control systems built into it, an Orbit Mode where the camera rotates around the centre of the scene, and an FPS Style where the user can look and move around as if they were in an FPS game.

Here you can see a solar system configured with one small and two large planets.

<img src="assets/img/posts/solar-system.png" width="75%" class="center" alt="A solar system configured with one small and two large planets">

### Keybindings

In the config file, a keybinding is represented by a number, the relationships between the keys on a keyboard and these numbers can be found [here on the GLFW website](https://www.glfw.org/docs/latest/group__keys.html).

 - `Quit (Esc)`: Quits the application
 - `Reset (R)`: Resets all the models to their initial state
 - `MoveForward (W)`: Moves the camera forwards when in FPS mode
 - `MoveBackward (S)`: Moves the camera backwards when in FPS mode
 - `MoveLeft (A)`: Moves the camera left when in FPS mode
 - `MoveRight (D)`: Moves the camera right when in FPS mode
 - `ToggleFPSStyle (T)`: Toggles the camera between an FPS mode and an orbit mode
 - `TogglePhysicsEnabled (P)`: Enables or disables physics

### Planet Configuration

The `planet.dat` file describes the solar system that the program will create. The first line of the file is to set up the sun. This is only a single number, which is the weight of the sun in kilograms.
Each following line in the file represents a planet. Planet lines can be commented out by placing a hash (#) at the very beginning of the line. The keys can be in any order or can be omitted, they are:

 - `name`: Not currently used by the program but allows you to label the planet within the file
 - `mass`: This is the mass of the planet in kilograms
 - `distance`: This is the initial distance for the centre of the planet to be from the centre of the sun in metres
 - `radius`: This is a multiplier for how large this planet should be represented in the scene relative to the sun. E.g.: 1 means the planet will graphically be the same size as the sun, 0.5 means the planet will be shown to be half the size of the sun
 - `initialForce`: This is a force applied to the planet one time when after physics is initially enabled, or after the scene is reset. This force is applied into the calculations before the mass of the planet is factored. This means the same force can be applied to two different planets of different masses
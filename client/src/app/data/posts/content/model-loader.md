This project is a model loader written in **C/C++** which is designed to load in both `.obj` and `.dae` 3D model files. It then renders them using **OpenGL**.

This program is configured though a single configuration file located in a `/media` file next to the `.exe`. Config within that file is a list of key/value pairs and sits in the following categories:

 - Window options
 - Background colour
 - Render options
 - Shaders
 - Keybindings
     - Model Rotation
     - Model Translation
     - Model Scale
     - Model Options
     - Window Options
     - Current Model Swapping
     - Exporting

### Functionality

When the program opens you should see an empty window showing only the configured background colour, by default, this is a pale blue. To add a model you need to press the `NewModel (N)` key. This will take the context away from the OpenGL window and back to the console window where it will prompt you for a file path to a model; the path can be absolute or relative to the `.exe`. On pressing enter, the context will then return to the OpenGL window. If the model is large then the program will lock up while it loads in the new model. On a modern machine, files like [creeper.obj](https://github.com/tobysmith568/SOFT-356_Model_Loader/blob/master/ModelLoader/Obj/Creeper.obj) should load instantly, files like [low_poly_boat.obj](https://github.com/tobysmith568/SOFT-356_Model_Loader/blob/master/ModelLoader/Obj/low_poly_boat.obj) should take around 10 seconds, and files like [low_poly_boat.dae](https://github.com/tobysmith568/SOFT-356_Model_Loader/blob/master/ModelLoader/Dae/Creeper.dae) should take just over 2 minutes.

Any model which is loaded into the scene can be manipulated while it is the currently active model. The `FirstModel (1)`, `SecondModel (2)` etc., keybindings can be used to swap the active model. Those 9 key bindings represent the first 9 models which are loaded into the scene, should there be more than 9 models loaded into the scene at a single time then any additional models past the 9th cannot be manipulated.

The `DeleteModel (Delete)` key binding can be used to remove models from the scene. It will always remove the model which was most recently added, not the currently active model.

The `Reset (R)` key binding can be used to reset the position, rotation, and scale of the currently active model.

The `PolygonMode (P)` key binding can be used to toggle between drawing faces and drawing lines only.

Here you can see a 3D model of a boat which I have loaded in. This boat is made from 40,000 triangles and 120,000 verticies.
<img src="assets/img/posts/model-loader.png" width="75%" class="center" alt="A 3D model of a boat loaded in using my software">

### Code Structure

#### Utilities

Large amounts of functionality within the program is broken down and encapsulated within stateless utility classes:
- `ConfigUtil` - used to read from the config.dat file
- `ConsoleUtil` - used to read from and write to the console window
- `FileUtils` - many different actions for interacting with files, folder, and file paths
- `GLEWUtil` - used to interact with the GLEW library
- `GLFWUtil` - used to interact with the GLFW library
- `InputManager` - used to register keyboard interactions and execute callback functions when those actions occur. (Note that this class is not stateless like the others as it stores the keyboard interactions to be executed)
- `ModelLoaderFactory` - used to return a model loader based on the file path it is given

These utility classes are all instantiated once within the main method and are then passed around wherever they are needed via constructor injection. Many of these classes rely on each other.

#### Model Loading

Each model loader class within the program extends the abstract class `IModelLoader`. When the `ModelLoaderFactory` is handed a file path, it returns an instance of the `IModelLoader` which is designed to handle the file in that path. Currently, there are three implementations:

- .obj (and .mtl and .png)
- .dae (and .png)
- .basic (and .png)

#### Core

The core program is broken down into the following structure:

- Scene
	- Shader Program
	- Models[]
		- Materials[]
		- MVP
		- Objects[]
			- Meshes[]
				- VAO
				- Vertices VBO
				- Indices EBO
				- Material&
				- Shader Program&

Details:

- There is a single `Scene` within the program, this represents what the user sees
- The `Shader Program` sits at the `Scene` level and remains constant after init
- The different `Model`s all sit within the `Scene`. Once per game tick, when the `Scene` is updated it must also call an update method on all of the `Model`s
- A `Model` holds all the different `Material`s that any of its child objects might use
- A `Model` has an MVP and it sets this as the current one each game tick before it then calls an update method on all of it's `Objects`
- `Objects` only act as a container for `Mesh`es. They exist to mirror the structure found within different model file types. When an `Object` is updated it must update all of it's `Mesh`es
- A `Mesh` contains the data required for OpenGL to render something. It also has references to a single `Material` and the `Shader program`

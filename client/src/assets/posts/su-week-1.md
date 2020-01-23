Initial progress has been quick as I managed to add all the controls to my player while I was testing ideas.  
Currently the player can:

- Walk
- Strafe
- Sprint
- Jump
- Crouch
- Scope up/out
- Shoot

Currently the player fires with raycasts and I still plan to move this over to pooled gameobjects to allow for bullet-drop and maybe even wind.

The player also needs to have their walking adjusted as currently it’s done by translating their transform and I’d rather it was achieved by applying forces to the rigidbody.

Another current problem which needs addressing is straferunning – this is where the player can achieve a speed faster than their max speed by moving forward and strafing at the same time, to fix this I need to clamp their speed to their max speed per frame.

The previous week has been used to develop the map which the game will be played in. Currently it has objects from the asset store spread sparsely around and does need probably around twice the current amount to look realistically populated.

The current assets include:

- Trees
- Abandoned houses
- Watchtowers
- Telephone poles
- Pond/lake

Still needed for sure are:

- Grass
- Vehicles
- Positions for the targets
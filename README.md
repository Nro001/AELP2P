# AELP2P (After Effects Linear Property to Property)
A simple plugin that is able to link different animation property types (1D and 2D) without requiring manual expression writing. Basically, a slider control auto-linker.

[<img alt="Donate" width="250px" src="https://github.com/Nro001/Nro-Galaxy-Editor/assets/107048186/4edb1609-e3d4-437e-8b43-43d34f293b16" />](https://ko-fi.com/O4O2UEDP5)

Features:
========================
- [x] Connect two properties of different layer (`Target` -> `Controller`)
- - [x] Scalar to Scalar (e.g. `Opacity` -> `Rotation`)
- - [x] Array to Array (e.g. `Scale` -> `Position`)
- - [x] Scalar to Array (e.g. `Opacity` -> `Position.X`)
- - [x] Array to Scalars (Split) (e.g. `Position` -> [`Opacity`,`Rotation`]
 
- [x] Connect two properties of two different composition (follow the workaround)

Instructions:
========================
Run this file as a script: `File` -> `Scripts` -> `Run Script File...`

Follow the instructions on the menu
1. Select a property with at least TWO keyframes
2. Hold Shift and select the controller property
3. Press `[Connect]`

import bpy
import os

# To use this script, open Blender, go to the Scripting workspace, 
# paste this code, and hit Run Script.

# 1. Clear existing objects
if bpy.context.mode != 'OBJECT':
    bpy.ops.object.mode_set(mode='OBJECT')
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# 2. Create geometric core (Icosphere)
bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=1)
obj = bpy.context.object

# 3. Add Wireframe to look mechanical
mod = obj.modifiers.new(name="Wireframe", type='WIREFRAME')
mod.thickness = 0.05
bpy.ops.object.modifier_apply(modifier="Wireframe")

# 4. Add Bevel
bevel = obj.modifiers.new(name="Bevel", type='BEVEL')
bevel.width = 0.02
bevel.segments = 2
bpy.ops.object.modifier_apply(modifier="Bevel")

# 5. Export to public/models directory of the Next.js app
# NOTE: Ensure this path is correct for your system!
export_dir = r"c:\Users\fredd\OneDrive\Desktop\ff360_labs\ff360_labs_website\public\models"
os.makedirs(export_dir, exist_ok=True)
export_path = os.path.join(export_dir, "ff360_core.glb")

bpy.ops.export_scene.gltf(filepath=export_path, export_format='GLB', use_selection=True)

print(f"Placeholder model exported to {export_path}")

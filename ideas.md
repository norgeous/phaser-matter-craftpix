# inputs
health
state changes (stun, damage, item picks)
keyboard controls
body sensors
proximity sensor (enemy)

# states
idle
walking
running
crouching
dashing
jumping
falling
doublejumping
climbing
hanging

attacking
attacking x4 anims
emoting x2 anims
talking
using

alive -> dying -> dead

aggrevated (enemy only?)

# status effects
status effects: none, hurt, stunned, poisoned, frozen, ablaze, wet, invulnerable, empowered
- duration
- cooldown
- priority
- combination: override | simultaneous | queue
- update fn (to setTint or update physics state)

# outputs
inventory
collision mask
current animation
arm position
velocity

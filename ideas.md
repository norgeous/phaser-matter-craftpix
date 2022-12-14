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
jumping
falling
doublejumping
attacking
crouching
attacking x4 anims
emoting x2 anims
climbing
talking
hanging
aggrevated
using
alive -> dying -> dead


# status effects
status effects: none, hurt, stunned, poisoned, frozen, ablaze, invulnerable, empowered
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

# inputs
health
state changes (stun, damage, item picks)
keyboard controls
body sensors
proximity sensor (enemy)

# states
idle
walk
run
sit
dash
jump
fall
doublejump
climb
hang
ragdoll

attack x4 anims
emote x2 anims
talk
use

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

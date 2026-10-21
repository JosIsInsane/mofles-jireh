import numpy as np, wave, sys
SR = 48000
T = 37.8
B = 0.6  # 100 BPM
N = int(SR * T)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)

def band(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(X, len(x))

def add(sig, t, g=1.0, pan=0.0):
    i = int(t * SR); j = min(N, i + len(sig))
    if i >= N: return
    s = sig[: j - i] * g
    L[i:j] += s * (1 - max(pan, 0)); R[i:j] += s * (1 + min(pan, 0))

def env(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(t / max(a, 1e-4), 1) * np.exp(-t / d)

def kick(g=1.0):
    n = int(0.5 * SR); t = np.arange(n) / SR
    f = 45 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.tanh(2.2 * np.sin(ph) * env(n, 0.002, 0.16)) * g

def clap():
    n = int(0.35 * SR)
    x = band(rng.standard_normal(n), 900, 5000)
    e = env(n, 0.001, 0.07)
    for k in (0.011, 0.022):
        i = int(k * SR); e[i:] += 0.6 * env(n - i, 0.001, 0.012)
    return x * e / 3

def hat(o=False):
    n = int((0.25 if o else 0.06) * SR)
    return band(rng.standard_normal(n), 7000, 16000) * env(n, 0.001, 0.08 if o else 0.018) / 2.5

def clang(f0=420, d=0.9):
    n = int(2.0 * SR); t = np.arange(n) / SR
    s = sum(a * np.sin(2 * np.pi * f0 * r * t) * np.exp(-t / (d / r ** 0.5))
            for r, a in ((1, 1), (2.76, .7), (5.40, .45), (8.93, .3), (13.3, .15)))
    s += band(rng.standard_normal(n), 2000, 9000) * env(n, 0.0005, 0.01)
    return s * env(n, 0.001, 10) / 2.2

def whoosh(dur=0.45):
    n = int(dur * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n)
    out = np.zeros(n); seg = 2048
    for i in range(0, n, seg // 2):
        p = i / n; c = 400 + 6000 * p ** 2
        w = band(x[i:i + seg] if i + seg <= n else np.pad(x[i:], (0, i + seg - n)), c * .5, c * 1.6) * np.hanning(seg)
        k = min(seg, n - i); out[i:i + k] += w[:k]
    return out * (t / dur) ** 2 / 2.5

def boom(g=1.0):
    n = int(3.0 * SR); t = np.arange(n) / SR
    f = 32 + 70 * np.exp(-t * 6)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.9)
    s += band(rng.standard_normal(n), 60, 2500) * env(n, 0.002, 0.25) * 0.5
    return np.tanh(1.8 * s) * g

def riser(dur):
    n = int(dur * SR); t = np.arange(n) / SR
    f = 200 * 2 ** (3 * t / dur)
    s = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.15 + band(rng.standard_normal(n), 1500, 12000) * 0.6
    return s * (t / dur) ** 2.5 / 2

def bassnote(f, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.tanh(2.5 * np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * 2 * f * t))
    return s * env(n, 0.005, dur * 0.6) * 0.35

# intro drone + weld crackle 0..3.6
n = int(3.8 * SR); t = np.arange(n) / SR
dr = (np.sin(2 * np.pi * 41.2 * t) + 0.5 * np.sin(2 * np.pi * 61.7 * t + np.sin(2 * np.pi * 0.3 * t))) * np.minimum(t / 1.2, 1) * 0.22
# no music bed: drone removed
for k in range(60):
    tt = rng.uniform(0.2, 3.4)
    add(band(rng.standard_normal(int(0.02 * SR)), 2500, 11000) * env(int(0.02 * SR), 0.0005, 0.004), tt, rng.uniform(.05, .25), rng.uniform(-.6, .6))
add(riser(1.2), 2.4, 0.9)
add(clang(330, 1.2), 0.15, 0.5)

# main groove 3.6..26.4 and outro groove 29.4..33.6
roots = [41.2, 41.2, 49.0, 36.7]
def groove(t0, t1, half=False):
    bt = t0; i = 0
    while bt < t1 - 1e-6:
        if not half or i % 2 == 0: add(kick(), bt, 0.95)
        if i % 4 in (1, 3) and not half: add(clap(), bt, 0.75, 0.1)
        if half and i % 4 == 2: add(clap(), bt, 0.6)
        add(hat(), bt + B / 2, 0.55, -0.3); add(hat(), bt, 0.25, 0.3)
        if i % 8 == 7: add(hat(True), bt + B / 2, 0.4, -0.3)
        r = roots[(i // 4) % 4]
        add(bassnote(r * 2, B * 0.45), bt, 1.0); add(bassnote(r * 2, B * 0.3), bt + B * 0.75, 0.7)
        bt += B; i += 1
# groove(3.6, 28.8)  # music removed, FX only
cuts = [3.6, 6.0, 8.4, 10.8, 13.2, 15.6, 18.0, 20.4, 22.8, 27.6]
for k, c in enumerate(cuts):
    add(whoosh(0.4), c - 0.4, 0.8, (-0.5 if k % 2 else 0.5))
    add(clang([420, 380, 470, 350][k % 4], 0.8), c, 0.35, (0.4 if k % 2 else -0.4))
add(boom(0.9), 3.6)
# generator montage: a hit on every cut
for k in range(1, 8):
    tt = 22.8 + k * B
    add(whoosh(0.18), tt - 0.18, 0.7, (-0.6 if k % 2 else 0.6))
    add(clang([560, 470, 620, 520][k % 4], 0.35), tt, 0.3, (0.5 if k % 2 else -0.5))
    add(hat(True), tt, 0.5)
add(boom(0.8), 22.8)
# build to logo
add(riser(1.2), 28.8, 1.1)
add(whoosh(0.6), 29.4, 1.0)
add(boom(1.0), 30.0)
add(clang(260, 1.6), 30.0, 0.6)
for tt in (30.5, 31.15):
    add(kick(1.0), tt, 0.9); add(clang(520, 0.6), tt, 0.3)
add(whoosh(0.3), 31.5, 0.6)
# groove(31.8, 36.0, half=True)  # music removed
add(boom(0.6), 36.0)
add(clang(300, 2.0), 36.0, 0.4)

st = np.stack([L, R], 1)
# simple glue: soft clip + normalize; fade tail
fade = np.ones(N); fn = int(1.4 * SR); fade[-fn:] = np.linspace(1, 0, fn) ** 2
st *= fade[:, None]
st = np.tanh(st * 1.3); st /= np.abs(st).max() * 1.12
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype('<i2').tobytes())

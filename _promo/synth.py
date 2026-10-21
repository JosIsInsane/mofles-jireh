import numpy as np, wave, sys
SR = 48000
T = 33.2
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

# FX only (no music). Timing matches index.html.
for k in range(40):
    tt = rng.uniform(0.2, 2.2)
    add(band(rng.standard_normal(int(0.02 * SR)), 2500, 11000) * env(int(0.02 * SR), 0.0005, 0.004), tt, rng.uniform(.05, .25), rng.uniform(-.6, .6))
add(riser(0.9), 1.5, 0.7)
add(boom(0.8), 2.4); add(clang(420, 0.8), 2.4, 0.3)
for k, c in enumerate([4.8, 9.6, 14.0, 16.0, 18.0, 21.0, 24.0]):   # dissolves / caption changes
    add(whoosh(0.6), c - 0.45, 0.2, (-0.4 if k % 2 else 0.4))
add(whoosh(0.4), 7.2 - 0.4, 0.8, 0.5); add(clang(380, 0.7), 7.2, 0.25, -0.4)    # whip
add(whoosh(0.5), 12.0 - 0.45, 0.8, -0.5); add(boom(0.5), 12.0)                  # brand wipe into generator
add(riser(1.2), 25.8, 0.9)
add(boom(1.0), 27.0); add(clang(260, 1.6), 27.0, 0.5)
for tt in (27.5, 28.15):
    add(kick(0.8), tt, 0.7); add(clang(520, 0.6), tt, 0.25)
add(whoosh(0.3), 28.5, 0.5)

st = np.stack([L, R], 1)
# simple glue: soft clip + normalize; fade tail
fade = np.ones(N); fn = int(0.8 * SR); fade[-fn:] = np.linspace(1, 0, fn) ** 2
st *= fade[:, None]
st = np.tanh(st * 1.3); st /= np.abs(st).max() * 1.12
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype('<i2').tobytes())

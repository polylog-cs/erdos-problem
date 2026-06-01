#!/usr/bin/env python3
"""Generate small algebraic toy point sets for unit-distance experiments."""

from __future__ import annotations

import csv
import itertools
import math
import os
import random
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

OUTPUT_DIR = Path("output")
MPLCONFIG_DIR = OUTPUT_DIR / ".mplconfig"
MPLCONFIG_DIR.mkdir(parents=True, exist_ok=True)
os.environ.setdefault("MPLCONFIGDIR", str(MPLCONFIG_DIR))

import matplotlib


matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import numpy as np  # noqa: E402


@dataclass(frozen=True)
class Experiment:
    name: str
    directions: tuple[complex, ...]
    side_lengths: tuple[int, ...]


@dataclass(frozen=True)
class UnitDifference:
    diff_id: int
    k: tuple[int, ...]
    z: complex
    edge_count: int


def u_alpha(alpha: float) -> complex:
    """Return (1 + alpha*i) / (1 - alpha*i), a unit complex number."""
    # For real alpha:
    #   u_alpha = (1 + alpha*i)/(1 - alpha*i)
    #           = (1 - alpha^2)/(1 + alpha^2)
    #             + (2 alpha)/(1 + alpha^2) i.
    # Hence |u_alpha| = 1.  For alpha=sqrt(d), these are toy norm-one
    # directions from fields like Q(sqrt(d), i) and multiquadratic
    # extensions with i adjoined.
    denom = 1.0 + alpha * alpha
    return complex((1.0 - alpha * alpha) / denom, (2.0 * alpha) / denom)


def make_points(
    directions: tuple[complex, ...], side_lengths: tuple[int, ...]
) -> tuple[list[tuple[int, tuple[int, ...], complex]], dict[tuple[int, ...], int]]:
    points: list[tuple[int, tuple[int, ...], complex]] = []
    coeff_to_id: dict[tuple[int, ...], int] = {}
    for point_id, coeffs in enumerate(itertools.product(*(range(L) for L in side_lengths))):
        z = sum(a * d for a, d in zip(coeffs, directions))
        points.append((point_id, coeffs, z))
        coeff_to_id[coeffs] = point_id
    return points, coeff_to_id


def guaranteed_edge_count(side_lengths: tuple[int, ...]) -> int:
    total = 0
    for j, L in enumerate(side_lengths):
        total += (L - 1) * math.prod(side_lengths[k] for k in range(len(side_lengths)) if k != j)
    return total


def is_canonical_difference(k: tuple[int, ...]) -> bool:
    for value in k:
        if value != 0:
            return value > 0
    return False


def find_unit_difference_vectors(
    directions: tuple[complex, ...], side_lengths: tuple[int, ...], tol: float = 1e-9
) -> list[UnitDifference]:
    unit_diffs: list[tuple[tuple[int, ...], complex, int]] = []
    ranges = [range(-(L - 1), L) for L in side_lengths]

    for k in itertools.product(*ranges):
        if not is_canonical_difference(k):
            continue
        z = sum(kj * dj for kj, dj in zip(k, directions))
        if abs(abs(z) - 1.0) < tol:
            edge_count = math.prod(L - abs(kj) for L, kj in zip(side_lengths, k))
            unit_diffs.append((k, z, edge_count))

    unit_diffs.sort(key=lambda item: item[0])
    return [
        UnitDifference(diff_id=diff_id, k=k, z=z, edge_count=edge_count)
        for diff_id, (k, z, edge_count) in enumerate(unit_diffs)
    ]


def write_points_csv(
    path: Path, points: list[tuple[int, tuple[int, ...], complex]], dimension: int
) -> None:
    with path.open("w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["id", *(f"coeff_{j}" for j in range(dimension)), "x", "y"])
        for point_id, coeffs, z in points:
            writer.writerow([point_id, *coeffs, f"{z.real:.17g}", f"{z.imag:.17g}"])


def write_unit_diffs_csv(path: Path, unit_diffs: list[UnitDifference], dimension: int) -> None:
    with path.open("w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["diff_id", *(f"k_{j}" for j in range(dimension)), "dx", "dy", "edge_count"])
        for diff in unit_diffs:
            writer.writerow(
                [
                    diff.diff_id,
                    *diff.k,
                    f"{diff.z.real:.17g}",
                    f"{diff.z.imag:.17g}",
                    diff.edge_count,
                ]
            )


def coefficient_ranges_for_difference(
    k: tuple[int, ...], side_lengths: tuple[int, ...]
) -> Iterable[range]:
    for kj, L in zip(k, side_lengths):
        start = max(0, -kj)
        stop = min(L, L - kj)
        yield range(start, stop)


def write_edges_csv(
    path: Path,
    unit_diffs: list[UnitDifference],
    side_lengths: tuple[int, ...],
    coeff_to_id: dict[tuple[int, ...], int],
) -> None:
    with path.open("w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["source_id", "target_id", "diff_id"])
        for diff in unit_diffs:
            for coeffs in itertools.product(*coefficient_ranges_for_difference(diff.k, side_lengths)):
                target = tuple(a + kj for a, kj in zip(coeffs, diff.k))
                source_id = coeff_to_id[coeffs]
                target_id = coeff_to_id[target]
                if source_id < target_id:
                    writer.writerow([source_id, target_id, diff.diff_id])
                else:
                    writer.writerow([target_id, source_id, diff.diff_id])


def sampled_edges(
    points: list[tuple[int, tuple[int, ...], complex]],
    coeff_to_id: dict[tuple[int, ...], int],
    unit_diffs: list[UnitDifference],
    side_lengths: tuple[int, ...],
    sample_size: int,
) -> list[tuple[complex, complex]]:
    point_by_id = {point_id: z for point_id, _, z in points}
    candidates: list[tuple[int, int]] = []
    for diff in unit_diffs:
        for coeffs in itertools.product(*coefficient_ranges_for_difference(diff.k, side_lengths)):
            target = tuple(a + kj for a, kj in zip(coeffs, diff.k))
            a = coeff_to_id[coeffs]
            b = coeff_to_id[target]
            candidates.append((min(a, b), max(a, b)))

    rng = random.Random(0)
    if len(candidates) > sample_size:
        candidates = rng.sample(candidates, sample_size)
    return [(point_by_id[a], point_by_id[b]) for a, b in candidates]


def plot_points(
    path: Path,
    experiment_name: str,
    points: list[tuple[int, tuple[int, ...], complex]],
    coeff_to_id: dict[tuple[int, ...], int],
    unit_diffs: list[UnitDifference],
    side_lengths: tuple[int, ...],
    actual_edges: int,
) -> None:
    z = np.array([point[2] for point in points], dtype=np.complex128)
    n = len(points)
    marker_size = 4.5 if n <= 1500 else 1.2
    edge_alpha = 0.16 if n <= 1500 else 0.08

    fig, ax = plt.subplots(figsize=(7, 7), dpi=145)
    for a, b in sampled_edges(points, coeff_to_id, unit_diffs, side_lengths, sample_size=500):
        ax.plot([a.real, b.real], [a.imag, b.imag], color="#4c78a8", lw=0.35, alpha=edge_alpha, zorder=1)
    ax.scatter(z.real, z.imag, s=marker_size, c="#111111", alpha=0.86, linewidths=0, zorder=2)

    ax.set_title(f"{experiment_name}: n={n}, unit edges={actual_edges}", fontsize=12)
    ax.set_aspect("equal", adjustable="box")
    ax.grid(True, color="#d8d8d8", lw=0.5, alpha=0.65)
    ax.tick_params(labelsize=8)
    ax.set_xlabel("Re")
    ax.set_ylabel("Im")
    fig.tight_layout()
    fig.savefig(path)
    plt.close(fig)


def run_experiment(experiment: Experiment) -> dict[str, float | int | str]:
    dimension = len(experiment.directions)
    points, coeff_to_id = make_points(experiment.directions, experiment.side_lengths)
    unit_diffs = find_unit_difference_vectors(experiment.directions, experiment.side_lengths)

    actual_edges = sum(diff.edge_count for diff in unit_diffs)
    guaranteed_edges = guaranteed_edge_count(experiment.side_lengths)

    write_points_csv(OUTPUT_DIR / f"{experiment.name}_points.csv", points, dimension)
    write_unit_diffs_csv(OUTPUT_DIR / f"{experiment.name}_unit_diffs.csv", unit_diffs, dimension)
    write_edges_csv(OUTPUT_DIR / f"{experiment.name}_edges.csv", unit_diffs, experiment.side_lengths, coeff_to_id)
    plot_points(
        OUTPUT_DIR / f"{experiment.name}.png",
        experiment.name,
        points,
        coeff_to_id,
        unit_diffs,
        experiment.side_lengths,
        actual_edges,
    )

    return {
        "name": experiment.name,
        "points": len(points),
        "guaranteed_edges": guaranteed_edges,
        "actual_edges": actual_edges,
        "average_degree": 2.0 * actual_edges / len(points),
        "unit_diffs": len(unit_diffs),
    }


def experiments() -> list[Experiment]:
    u2 = u_alpha(math.sqrt(2.0))
    u3 = u_alpha(math.sqrt(3.0))
    u5 = u_alpha(math.sqrt(5.0))
    u6 = u_alpha(math.sqrt(6.0))
    u7 = u_alpha(math.sqrt(7.0))
    u10 = u_alpha(math.sqrt(10.0))

    qsqrt2_dirs = (1 + 0j, 1j, u2, 1j * u2)
    qsqrt3_dirs = (1 + 0j, 1j, u3, 1j * u3)
    qsqrt5_dirs = (1 + 0j, 1j, u5, 1j * u5)
    biquad_6_dirs = (1 + 0j, 1j, u2, 1j * u2, u3, 1j * u3)
    biquad_8_dirs = (1 + 0j, 1j, u2, 1j * u2, u3, 1j * u3, u6, 1j * u6)
    triquad_8_dirs = (1 + 0j, 1j, u2, 1j * u2, u3, 1j * u3, u5, 1j * u5)
    multiquad_14_dirs = (
        1 + 0j,
        1j,
        u2,
        1j * u2,
        u3,
        1j * u3,
        u5,
        1j * u5,
        u6,
        1j * u6,
        u7,
        1j * u7,
        u10,
        1j * u10,
    )

    all_dirs = {
        "1": 1 + 0j,
        "i": 1j,
        "u2": u2,
        "i*u2": 1j * u2,
        "u3": u3,
        "i*u3": 1j * u3,
        "u5": u5,
        "i*u5": 1j * u5,
        "u6": u6,
        "i*u6": 1j * u6,
        "u7": u7,
        "i*u7": 1j * u7,
        "u10": u10,
        "i*u10": 1j * u10,
    }
    print("Direction lengths:")
    for name, direction in all_dirs.items():
        print(f"  {name:4s} |d| = {abs(direction):.17g}")
    print()

    return [
        Experiment("qsqrt2_1k", qsqrt2_dirs, (6, 6, 6, 6)),
        Experiment("qsqrt2_10k", qsqrt2_dirs, (10, 10, 10, 10)),
        Experiment("biquad_1k", biquad_6_dirs, (4, 4, 3, 3, 3, 3)),
        Experiment("biquad_10k", biquad_8_dirs, (4, 4, 3, 3, 3, 3, 3, 3)),
        Experiment("qsqrt3_10k", qsqrt3_dirs, (10, 10, 10, 10)),
        Experiment("qsqrt5_10k", qsqrt5_dirs, (10, 10, 10, 10)),
        Experiment("triquad_235_6k", triquad_8_dirs, (3, 3, 3, 3, 3, 3, 3, 3)),
        Experiment("multiquad_2357_bool14", multiquad_14_dirs, (2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2)),
    ]


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    rows = [run_experiment(experiment) for experiment in experiments()]

    print("Summary:")
    print(
        f"{'experiment':12s} {'points':>8s} {'guaranteed':>12s} "
        f"{'actual':>10s} {'avg_deg':>9s} {'diffs':>7s}"
    )
    for row in rows:
        print(
            f"{row['name']:12s} {row['points']:8d} {row['guaranteed_edges']:12d} "
            f"{row['actual_edges']:10d} {row['average_degree']:9.2f} {row['unit_diffs']:7d}"
        )


if __name__ == "__main__":
    main()

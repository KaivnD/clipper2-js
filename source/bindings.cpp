#pragma once

#include <emscripten/bind.h>
#include <iostream>
#include <algorithm>
#include <vector>
#include <cmath>
#include <fmt/core.h>
#include "clipper2/clipper.h"

using namespace emscripten;
using namespace Clipper2Lib;

//   using Point64 = Point<int64_t>;
//   using PointD = Point<double>;

//   template <typename T>
//   using Path = std::vector<Point<T>>;
//   template <typename T>
//   using Paths = std::vector<Path<T>>;

//   using Path64 = Path<int64_t>;
//   using PathD = std::vector<PointD>;
//   using Paths64 = std::vector< Path64>;
//   using PathsD = std::vector< PathD>;

EMSCRIPTEN_BINDINGS(clipper2)
{

    enum_<FillRule>("FillRule")
        .value("EvenOdd", FillRule::EvenOdd)
        .value("NonZero", FillRule::NonZero)
        .value("Positive", FillRule::Positive)
        .value("Negative", FillRule::Negative)
        //
        ;

    value_object<PointD>("PointD")
        .field("x", &PointD::x)
        .field("y", &PointD::y)
        //
        ;

    register_vector<PointD>("PathD");
    register_vector<PathD>("PathsD");

    function("union", select_overload<PathsD(const PathsD &, FillRule, int)>(&Union));
    function("makePathD", &MakePathD);
}

int main() { return 0; }
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

EMSCRIPTEN_BINDINGS(clipper2)
{

    enum_<FillRule>("FillRule")
        .value("EvenOdd", FillRule::EvenOdd)
        .value("NonZero", FillRule::NonZero)
        .value("Positive", FillRule::Positive)
        .value("Negative", FillRule::Negative)
        //
        ;

    enum_<JoinType>("JoinType")
        .value("Square", JoinType::Square)
        .value("Round", JoinType::Round)
        .value("Miter", JoinType::Miter)
        //
        ;

    enum_<EndType>("EndType")
        .value("Polygon", EndType::Polygon)
        .value("Joined", EndType::Joined)
        .value("Butt", EndType::Butt)
        .value("Square", EndType::Square)
        .value("Round", EndType::Round)
        //
        ;

    value_array<Point64>("Point64")
        .element(&Point64::x)
        .element(&Point64::y)
        //
        ;

    value_array<PointD>("PointD")
        .element(&PointD::x)
        .element(&PointD::y)
        //
        ;

    register_vector<Point64>("Path64");
    register_vector<Path64>("Paths64");

    register_vector<PointD>("PathD");
    register_vector<PathD>("PathsD");

    function("union", select_overload<PathsD(const PathsD &, FillRule, int)>(&Union));
    function("union", select_overload<Paths64(const Paths64 &, FillRule)>(&Union));

    function("union2", select_overload<PathsD(const PathsD &, const PathsD &, FillRule, int)>(&Union));
    function("union2", select_overload<Paths64(const Paths64 &, const Paths64 &, FillRule)>(&Union));

    function("intersect", select_overload<PathsD(const PathsD &, const PathsD &, FillRule, int)>(&Intersect));
    function("intersect", select_overload<Paths64(const Paths64 &, const Paths64 &, FillRule)>(&Intersect));

    function("difference", select_overload<PathsD(const PathsD &, const PathsD &, FillRule, int)>(&Difference));
    function("difference", select_overload<Paths64(const Paths64 &, const Paths64 &, FillRule)>(&Difference));

    function("xor", select_overload<PathsD(const PathsD &, const PathsD &, FillRule, int)>(&Xor));
    function("xor", select_overload<Paths64(const Paths64 &, const Paths64 &, FillRule)>(&Xor));

    function("inflatePaths", select_overload<PathsD(const PathsD &, double,
                                                    JoinType, EndType, double, double)>(&InflatePaths));
    function("inflatePaths", select_overload<Paths64(const Paths64 &, double,
                                                     JoinType, EndType, double)>(&InflatePaths));
    function("makePathD", &MakePathD);
    function("makePath", &MakePath);
}

int main() { return 0; }
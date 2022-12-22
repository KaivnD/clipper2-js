add_requires("fmt")

target "clipper2-js"
    set_kind("binary")
    set_filename("clipper2.js")

    add_cxflags "-fPIC"

    add_files "source/*.cpp"

    add_ldflags("-Wall -Wno-overloaded-virtual -Wno-switch -Wno-unknown-pragmas -Wno-unused-private-field")
    add_ldflags("-s MODULARIZE=1 -s EXPORT_NAME=clipper2")
    -- add_ldflags("-s EXPORT_ES6=1")
    -- add_ldflags("-s WASM=0")
    add_ldflags("-s WASM_BIGINT")
    add_ldflags("-s ALLOW_MEMORY_GROWTH=1 -lembind")
    -- set_targetdir("./dist")
    add_includedirs("3rdparty/Clipper2/CPP/Clipper2Lib/include")
    add_files "3rdparty/Clipper2/CPP/Clipper2Lib/src/*.cpp"

    set_languages "c++17"
    add_packages("fmt")

    after_link(function (target)
        local js = path.join(target:targetdir(), "clipper2.js")
        local mjs = path.join(target:targetdir(), "clipper2.mjs")
        os.cp(js, mjs)
        os.runv("patch", {mjs, path.join(os:projectdir(), "assets", "clipper2.mjs.diff")})
    end)

# WABI

WebAssembly Binary Interface

## Usage

```bash
npm install -g wabic
wabic /path/to/header.h
```

## Mission

WABI is a tool to generate a stable WebAssembly binary interface for `libuv`. As
a side effect, it can also generate the same binary interface for anything that
has an exposed C header file.

Artifacts of WABI tool is a single `.h` file and a single `.cc` file, containing
all the abstractions needed for a WebAssembly binary to talk to native binaries.

## Support

WABI uses CastXML under the hood to parse the C header file. From the parser's
side, anything that is supported by CastXML, should also be supported by WABI.

WABI has a generator that abstracts 64 bit types, strings, and pointers from the
WebAssembly module. The generator only supports as much needed for `libuv`, but
extending it should not be difficult.

## Example

input header file:

```c
// input.h
void* example_function();
```

output header file:

```c
// input-wabi.h
typedef int Quark;
Quark wabi_example_function();
```

output header implementation:

```cpp
// input-wabi.cc
extern "C" {
Quark wabi_example_function() {
  // ...
} // !wabi_example_function
} // !extern "C"
```

You may notice that `void*` is no longer exposed in the final interface. This is
an intentional behavior. WABI borrows the idea of Quarks from GTK and wraps your
return types and arguments in Quarks. Quarks allow data to safely pass through a
WebAssembly runtime and back into native land.

WABI currently tries to wrap everything that is not an integer, into a Quark.

## Dependencies

WABI currently relies on C++17's `std::any`.
[Alternatives](https://github.com/thelink2012/any) exists for older C++.

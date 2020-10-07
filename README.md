# axios-chain

An [axios](https://github.com/axios/axios) wrapper to build requests in a chain way.

## Motivation

Curiosity. How would be to use [axios](https://github.com/axios/axios) in chain?
Would it be more verbose? Enjoyable? Worth it? Let's find out!

## Installing

**NOT PUBLISHED YET**

## Example

GET request:
```js
// original way
axios.get('/user?ID=12345');
// or
axios.get('/user', {
  params: {
    ID: 12345
  }
});

// chain way
axiosChain.get('/user')
  .queryParams({ ID: 12345 })
  .send();
```

Pre-configured request:
```js
const userRequest = axiosChain.request()
  .baseURL('https://some-api.com')
  .url('/user/:userId');

// GET request
userRequest
  .method('GET')
  .pathParams({ userId: 12345 })
  .send();

// PUT request
userRequest
  .method('PUT')
  .pathParams({ userId: 12345 })
  .send(requestBody);
```

## API

The AxiosChain just build the [AxiosRequestConfig]([AxiosConfigChain](#AxiosConfigChain))
in a different way, letting the axios sets the default values. When the docs below
says that some function "sets `<PROP>`" it is referring to the AxiosRequestConfig's `<PROP>`.

### AxiosChain

`AxiosChain` is the default export. It contains the request method aliases and a
generic function. All options return an [AxiosConfigChain](#AxiosConfigChain) and
can receive a type `<T>` (which default is `any`) to define the axios' returns
type (`AxiosPromise<T>`).

Function                   | Description
---------------------------|------------------------------------------------------
`request<T>()`             | Just return an [AxiosConfigChain](#AxiosConfigChain).
`get<T>(url: string)`      | Sets `url` and `method='GET'`.
`post<T>(url: string)`     | Sets `url` and `method='POST'`.
`put<T>(url: string)`      | Sets `url` and `method='PUT'`.
`patch<T>(url: string)`    | Sets `url` and `method='PATCH'`.
`delete<T>(url: string)`   | Sets `url` and `method='DELETE'`.
`head<T>(url: string)`     | Sets `url` and `method='HEAD'`.
`options<T>(url: string)`  | Sets `url` and `method='OPTIONS'`.

### AxiosConfigChain

The `AxiosConfigChain` is an object with some functions to help building the
config object. It returns itself. The only exception is the `send` method that
calls the axios and return an `AxiosPromise<T>`.

Function                                   | Description
-------------------------------------------|------------------------------------
`url(url: string)`                         | Sets `url`.
`baseURL(baseURL: string)`                 | Sets `baseURL`.
`pathParams(pathParams: PathParams)`       | Replaces path params on `url` and `baseURL` when `send` is called.
`queryParams(queryParams: any)`            | Sets `params`.
`method(method: Method)`                   | Sets `method`.
`headers(headers: any)`                    | Sets `headers`.
`timeout(timeout: number)`                 | Sets `timeout`.
`expect(responseType: ResponseType)`       | Sets `responseType`.
`instance(instance: AxiosInstance)`        | Makes the `send` to call a custom `AxiosInstance`.
`config(axiosConfig: AxiosRequestConfig)`  | Sets all options of `AxiosRequestConfig`. Use it for configs not listed above.
`send(data?: any)`                         | Sets `data` (optional) and calls axios.

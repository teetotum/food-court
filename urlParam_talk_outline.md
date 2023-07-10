# url param talk outline

## initial use-case: sync a state value with the URL

- show example application: sorting and filtering
- show naive implementation with history.push
- show that it initially works, but breaks when a second param is introduced
- explain useUrlSearchParam hook to solve it (using only useLocation)
- show problem when two calls happen synchronously
- explain difference betwixed useLocation and window.location
- introduce use-case with array value (example application: filtering)
- show comma separated approach and its problems
- reveal that multiple values with the same key are allowed
- explain better alternative using multiple values with the same key
- explain problem with missing `.delete(key,value)`
- show github discussion and polyfill https://www.npmjs.com/package/url-search-params-delete
- reveal the news that it was added to the standard

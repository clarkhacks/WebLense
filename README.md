# WebLense

Live screenshot API.

## API

/lense/**HEIGHT**x**WIDTH**/

**Paramters:**

| Parameter  | Description                         |
| ---------- | ----------------------------------- |
| **HEIGHT** | Height of the screenshot in pixels. |
| **WIDTH**  | Width of the screenshot in pixels.  |

**Queries:**

| Parameter | Description                           |
| --------- | ------------------------------------- |
| **url**   | URL of the page to screenshot.        |
| **full**  | If true, the entire page is captured. |
| **type**  | Type of screenshot. png/jpeg          |

## Example

![Google](https://weblense.wkmn.app/lense/800x600/?url=https://www.google.com)
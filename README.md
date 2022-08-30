<h1 align="center"><img src="https://github.com/clarkhacks/100Concepts/raw/main/shared/img/header.png" style="width: 100%; max-width: 400px;"/></h1>
<h3 align="center">I have at max 200 days to publish 100 of my application concepts. Some are fancier than others, join me on my journey to become a better developer.</h3>

## WebLense

* Similar to the codepen.io preview
* Save Photos for fast access
* Refresh photos
* Basic controls

__Todo:__
* ✅ Capture screenshot
* ✅ Serve screenshot if exists
* ✅ Rate limits for bots
* ✅ Error handling
* ✅ Documentation
* ✅ Host It!


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

![Clark.Today](https://weblense.wkmn.app/lense/800x1200/?url=https://www.clark.today)
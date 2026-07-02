import copy

UPSCALE_WORKFLOW_TEMPLATE = {
  "1": {
    "inputs": {
      "image": "placeholder.png"
    },
    "class_type": "LoadImage",
    "_meta": {
      "title": "Load Image"
    }
  },
  "2": {
    "inputs": {
      "model_name": "4x-UltraSharp.pth"
    },
    "class_type": "UpscaleModelLoader",
    "_meta": {
      "title": "Load Upscale Model"
    }
  },
  "3": {
    "inputs": {
      "upscale_model": [
        "2",
        0
      ],
      "image": [
        "1",
        0
      ]
    },
    "class_type": "ImageUpscaleWithModel",
    "_meta": {
      "title": "Upscale Image (using Model)"
    }
  },
  "4": {
    "inputs": {
      "filename_prefix": "kemas_upscale_",
      "images": [
        "3",
        0
      ]
    },
    "class_type": "SaveImage",
    "_meta": {
      "title": "Save Image"
    }
  }
}

def build_upscale_workflow(image_filename: str):
    workflow = copy.deepcopy(UPSCALE_WORKFLOW_TEMPLATE)
    workflow["1"]["inputs"]["image"] = image_filename
    return workflow

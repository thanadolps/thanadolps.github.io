// Slider Creation
let container_slider_blocks = document.getElementById("container_slider_blocks");
let prototype_sliders_block = document.getElementById("prototype_sliders_block")

decorate_slider_block(prototype_sliders_block.firstElementChild, prototype_sliders_block.lastElementChild, 0);
for(let i = 1 ; i < 25 ; i++)
{
    const slider_block = prototype_sliders_block.cloneNode(true);
    decorate_slider_block(slider_block.firstElementChild, slider_block.lastElementChild, i);

    container_slider_blocks.appendChild(slider_block);
}

/**
 * Change Propoty of slider block depending on index
 * @param {HTMLParagraphElement} label 
 * @param {HTMLInputElement} slider
 * @param {Number} index 
 */
function decorate_slider_block(label, slider, index)
{
    label.innerHTML = `<span>PC${index+1}: </span><span></span>`;
    slider.oninput = function()
    {
        label.lastChild.textContent = this.value;
    }
}

/**
 * 
 * @param {HTMLDivElement} container_slider_blocks 
 */
function tensor_from_container_slider_block(container_slider_blocks)
{
    const temp_value_array = [];
    for(let slider_block of container_slider_blocks.children)
    {
        temp_value_array.push(slider_block.lastElementChild.value)
    }
    return tf.tensor(temp_value_array, null, 'float32');
}


// Model Loading and Inference

document.getElementById('button_load').onclick = fetchModel;
document.getElementById('button_inference').onclick = inference;

let image_reconstuct = document.getElementById('image_reconstuct');
let canvas_reconstruct = document.getElementById('canvas_reconstruct');

var encoder;
var decoder;
var pca_mean;
var pca_component;

let loading_progress_tracker = 0;
const loading_progress_count = 3;

function add_loading_progress()
{
    loading_progress_tracker += 1
    if(loading_progress_tracker >= loading_progress_count)
    {
        console.log("Inference Ready");
        document.getElementById('button_inference').disabled = false;
    }
}

/**
 * Load Encoder and decoder model
 */
function fetchModel()
{
    tf.loadModel('./encoder_3/model.json').then((model) =>
    {
        encoder = model;

        console.log("Encoder Loaded");
        add_loading_progress();
    });
    tf.loadModel('./decoder_3/model.json').then((model) =>
    {
        decoder = model;

        console.log("Decoder Loaded");
        add_loading_progress();
    });
    jQuery.getJSON("pca.json").done((jsonArray) => {
        pca_mean = tf.tensor(jsonArray['mean'])
        pca_component = tf.tensor(jsonArray['component'])

        console.log("PCA Loaded")
        add_loading_progress();
    })
}

function inference()
{
    // let image = tf.ones([1, 28, 28, 1]);
    // let latent = encoder.predict(image);
    pca_latent = tensor_from_container_slider_block(container_slider_blocks);
    latent = tf.addStrict(tf.dot(pca_latent, pca_component), pca_mean);
    
    let reconstruct = decoder.predict(latent.expandDims());

    tf.browser.toPixels(reconstruct.squeeze(), canvas_reconstruct).then(() =>
    {   
        image_reconstuct.src = canvas_reconstruct.toDataURL();
    });
}
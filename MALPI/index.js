// Slider Creation
let container_slider_blocks = document.getElementById("container_slider_blocks");
let prototype_sliders_block = document.getElementById("prototype_sliders_block")

function populate_slider_block(count, variances_ratio)
{
    decorate_slider_block(prototype_sliders_block.firstElementChild,
         prototype_sliders_block.lastElementChild, 0, variances_ratio[0]);
    for(let i = 1 ; i < count ; i++)
    {
        const slider_block = prototype_sliders_block.cloneNode(true);
        decorate_slider_block(slider_block.firstElementChild, slider_block.lastElementChild, i, variances_ratio[i]);

        container_slider_blocks.appendChild(slider_block);
    }
}

/**
 * Change Propoty of slider block depending on index
 * @param {HTMLParagraphElement} label 
 * @param {HTMLInputElement} slider
 * @param {Number} index 
 */
function decorate_slider_block(label, slider, index, variance_ratio)
{
    const display_number = ("0" + (index + 1)).slice(-2);
    let variance_percent = (100 * variance_ratio).toPrecision(2);
    label.innerHTML = `PC ${display_number}: <span style='float:right'>(${variance_percent}%)</span><b>0.00</b>`;
    slider.oninput = function()
    {
        label.lastChild.textContent = parseFloat(this.value).toFixed(2);
        inference();
    }
    /*slider.onchange = function () {
        inference();
    }*/
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

fetchModel();

let image_reconstuct = document.getElementById('image_reconstuct');
let canvas_reconstruct = document.getElementById('canvas_reconstruct');

var encoder;
var decoder;
var pca_mean;
var pca_component;

let loading_progress_tracker = 0;
const loading_progress_count = 3;

/**
 * called when loading has progressed
 */
function add_loading_progress()
{
    loading_progress_tracker += 1

    // check if loading has finished (tracker > count)
    if(loading_progress_tracker >= loading_progress_count)
    {
        console.log("Inference Ready");
        
        // enable slider
        for(slider of document.getElementsByClassName("disabled-slider"))
        {
            slider.disabled = false;
        }

        // change model loading to blur/unblur button
        let infer_button = document.getElementById('button_inference');
        
        infer_button.disabled = false;
        infer_button.classList.replace("w3-red", "w3-teal");
        infer_button.textContent = "Aliasing";
        infer_button.onclick = toggle_blur;

        image_reconstuct.hidden = false;

        inference();
    }
}

function toggle_blur()
{
    switch(this.textContent)
    {
        case "Aliasing": 
            this.textContent = "Pixelated"; 
            image_reconstuct.style.imageRendering = "pixelated";
            break;
        case "Pixelated": 
            this.textContent = "Aliasing";
            image_reconstuct.style.imageRendering = "auto";
            break;
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
        let pca_variances_ratio = jsonArray['variances_ratio']

        console.assert(pca_mean.size == pca_component.shape[1], "PCA Mean and Component are Not Compatible")
        console.log("PCA Loaded")
        
        populate_slider_block(pca_mean.size, pca_variances_ratio);

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

// randomization

document.getElementById("button_random").onclick = function()
{
    const normalDistTensor = tf.randomNormal([container_slider_blocks.childElementCount], 0, 0.5);
    const normalDist = normalDistTensor.arraySync();
    normalDistTensor.dispose();
    for(let i = 0 ; i < container_slider_blocks.childElementCount ; i++)
    {
        let slider_block = container_slider_blocks.children[i];
        let slider = slider_block.lastElementChild;

        let normal_val = normalDist[i]
        slider.value = normal_val;
        slider_block.firstElementChild.lastChild.textContent = normal_val.toFixed(2);
    }
    inference();
}

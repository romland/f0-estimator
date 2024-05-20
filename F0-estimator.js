/**
 * An estimator for F0 of a stream.
 *
 * Or in English: Estimate the number of distinct elements in a data stream using
 * a minimal (configurable) amount of memory.
 * 
 * Paper:
 * Distinct Elements in Streams: An Algorithm for the (Text) Book
 * https://arxiv.org/pdf/2301.10191
 */
export default class F0Estimator
{
    /**
     * Initializes the F0Estimator with precision epsilon and confidence delta.
     *
     * @param {number} epsilon - Precision of the estimate, must be between 0 and 1 (non-inclusive)
     * @param {number} delta - Confidence in the estimate, must be between 0 and 1 (non-inclusive)
     */
    constructor(epsilon, delta)
    {
        this.epsilon = epsilon;
        this.delta = delta;
        this.X = new Set();
        this.p = 1;
        this.thresh = 0;
    }
    
    /**
     * Updates the threshold value based on the stream length provided.
     *
     * @param {number} streamLength 
     */
    updateThresh(streamLength)
    {
        this.thresh = Math.ceil(12 / Math.pow(this.epsilon, 2) * Math.log(8 * streamLength / this.delta));
    }
    
    /**
     * Processes a single item from the stream, updating the set X accordingly and adjusting p if necessary.
     *
     * @param {T} item 
     * @returns {boolean} success
     */
    processStreamItem(item)
    {
        if(this.X.has(item)) {
            this.X.delete(item);
        }
        
        if(Math.random() < this.p) {
            this.X.add(item);
        }

        let setItem;
        while(this.X.size === this.thresh) {
            for(setItem of this.X) {
                if (Math.random() < 0.5) {
                    this.X.delete(setItem);
                }
            }
            this.p /= 2;
        }
        
        return this.X.size !== this.thresh;
    }

    /*
     * @returns {number|null} Estimated F0, or `null` if failed to estimate
     */
    getEstimate()
    {
        return this.X.size / this.p;
    }
}

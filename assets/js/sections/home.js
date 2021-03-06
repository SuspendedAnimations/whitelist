import framework from 'framework'
import config from 'config'
import utils from 'utils'
import create from 'dom-create-element'
import classes from 'dom-classes'
import Default from './default'
import event from 'dom-events'
import $ from 'dom-select'
import Pixi from '../components/pixi'
import Manager from 'slider-manager'

class Home extends Default {
	
	constructor(opt) {
		
		super(opt)

		this.slug = 'home'
		this.ui = null
		this.prevent = false
	}
	
	init(req, done) {

		// req.previous && req.previous.route.substring(0, 5) === '/work' && req.previous.params && (this.index = req.previous.params.id)
		
		super.init(req, done)
	}
	
	dataAdded(done) {
		
		super.dataAdded()
		
		const random = Math.floor(Math.random()*APP.VIDEOS.length)
		
		this.ui.video.src = APP.VIDEOS[random].video
		this.ui.video.load()
		this.ui.video.play()
		
		this.addEvents()
		
		done()
	}

	addEvents() {
		
		this.canvas = new Pixi({ container: this.ui.mask })
		this.canvas.init()
	}
	
	removeEvents() {

		this.canvas && this.canvas.destroy()
		
		event.off(config.$body, 'mousewheel',  this.goWorks)
	}
	
	goWorks() {
		
		framework.go('/work')
	}
	
	animateIn(req, done) {
		
		const work = req.previous && req.previous.route === `/work/:id`
		
		this.ui.intro.style.display = 'block'
		
		requestAnimationFrame(() => classes.add(this.ui.logo, `animateIn`))
		
		const tl = new TimelineMax({ paused: true, onComplete: () => {

			event.on(config.$body, 'mousewheel', this.goWorks)
			this.ui.intro.parentNode.removeChild(this.ui.intro)
			done()
		}})
		tl.to(this.ui.container, 1.9, { y: 0, ease: Expo.easeInOut }, 2)
  		tl.to(this.ui.clip, 1.9, { y: 0, ease: Expo.easeInOut }, 2)
  		tl.add(() => classes.add(this.ui.container, `animateIn`), 3)
  		tl.from(this.ui.letter[0], 1, { x: '-100%' }, 3)
  		tl.from(this.ui.letter[1], 1, { x: '100%' }, 3)
  		tl.from(this.ui.infos, 1, { autoAlpha: 0, x: '30%', clearProps: 'all' })
  		tl.from(this.ui.infos.querySelector('span'), 1, { autoAlpha: 0, x: '-10%', clearProps: 'all' }, '-=0.6')
  		tl.staggerFrom(this.ui.social, 1.1, { autoAlpha: 0, y: '60%', clearProps: 'all' }, .09, '-=2')
  		tl.restart()

  		classes.remove(config.$body, 'is-loading')
  		classes.add(config.$body, `is-${this.slug}`) 
	}
	
	animateOut(req, done) {

		classes.add(config.$body, 'is-loading')
		
		const work = req.route && req.route === config.routes.work
		
		classes.remove(config.$body, `is-${this.slug}`)
		classes.remove(this.ui.container, `animateIn`)
		classes.remove(this.ui.logo, `animateIn`)
		
		const tl = new TimelineMax({ paused: true, onComplete: done })
		tl.to(this.ui.letter[0], 1.3, { x: '-100%', ease: Expo.easeInOut }, .15)
  		tl.to(this.ui.letter[1], 1.6, { x: '100%', ease: Expo.easeInOut }, 0)
		tl.to(this.ui.infos, .8, { autoAlpha: 0, x: '30%' }, 0)
  		tl.to(this.ui.infos.querySelector('span'), 1, { autoAlpha: 0, x: '-10%' }, 0)
  		tl.staggerTo(this.ui.social, .9, { autoAlpha: 0, y: '60%' }, -.09, 0)
  		tl.to(this.ui.container, 1.6, { y: '100%', ease: Expo.easeInOut }, .8)
  		tl.to(this.ui.clip, 1.6, { y: '50%', ease: Expo.easeInOut }, .8)
  		// work && tl.to(this.ui.clip, 1.6, { y: '-100%', rotationZ: 45, ease: Expo.easeInOut }, .6)
  		tl.restart()
	}
	
	resize(width, height) {
		
		super.resize(width, height)
	}

	debounce() {

		super.debounce()
		
		this.canvas && this.canvas.resize()
	}

	destroy(req, done) {

		super.destroy()
		
		this.removeEvents()
		
		this.page.parentNode.removeChild(this.page)
		
		done()
	}
}

module.exports = Home
function moveSlide (box, index, paginatorItems) {
  const children = box.children()
  const lastIndex = children.length - 1

  if (index < 0) {
    index = lastIndex
  }

  if (index > lastIndex) {
    index = 0
  }
  
  children.removeClass('active')
  children.eq(index).addClass('active')

  paginatorItems.removeClass('active')
  paginatorItems.eq(index).addClass('active see')
}

function nextSlide (box, paginatorItems) {
  let currentSlideElement = box.find('.slide.active')
  const nextActiveSlide = currentSlideElement.index() + 1
  moveSlide(box, nextActiveSlide, paginatorItems)
}

function prevSlide (box, paginatorItems) {
  let currentSlideElement = box.find('.slide.active')
  const nextActiveSlide = currentSlideElement.index() - 1
  moveSlide(box, nextActiveSlide, paginatorItems)
}

function hideOverlay () {
  const overlay = $('[script-role="overlay"]')
  overlay.html('')
  overlay.removeClass('show')
}

function messageOverlay (message) {
  const overlay = $('[script-role="overlay"]')
  overlay.addClass('show')
  overlay.html(message)
  $('[script-role="overlay"] .message').click(function (e) {
    e.stopPropagation()
  })
}

$(function() {
  $('[script-role="slider"]').each(function (index, slider) {
    const sliderSelector = $(slider)

    const sliderBox = $(sliderSelector.find('.slider-content'))
    const paginatorItems = sliderSelector.find('.slider-pagination .item')

    sliderSelector.find('.slider-control .right').click(function (e) {
      e.preventDefault()
      nextSlide(sliderBox, paginatorItems)
    })

    sliderSelector.find('.slider-control .left').click(function (e) {
      e.preventDefault()
      prevSlide(sliderBox, paginatorItems)
    })

    paginatorItems.click(function (e) {
      e.preventDefault()
      const index = $(this).index()
      moveSlide(sliderBox, index, paginatorItems)
    })
  })

  $('[script-role="dashboard"]').each(function (index, dashboard) {
    const self = $(dashboard)
    const toggle = self.find('.dashboard-toggle')
    const container = self.find('.dashboard-content')
    toggle.click(function (e) {
      if (toggle.hasClass('state-1')) {
        toggle.removeClass('state-1')
        toggle.addClass('state-2')
        container.removeClass('state-1')
        container.addClass('state-2')
        return
      }
      if (toggle.hasClass('state-2')) {
        toggle.removeClass('state-2')
        toggle.addClass('state-3')
        container.removeClass('state-2')
        container.addClass('state-3')
        return
      }
      if (toggle.hasClass('state-3')) {
        toggle.removeClass('state-3')
        toggle.addClass('state-1')
        container.removeClass('state-3')
        container.addClass('state-1')
        return
      }
    })
  })

  $('[script-role="menu"]').click(function (e) {
    e.preventDefault()
    $('[script-role="menu-box"]').toggleClass('open')
  })

  $('[script-role="overlay"]').click(function (e) {
    hideOverlay()
  })

  const formSucces = '<div class="message">OK!</div>'
  const formError = '<div class="message">Error</div>'

  $('form').validate({
    rules: {
      email: {
        required: true,
        email: true
      },
      age: {
        required: true,
        number: true, 
      },
      check: {
        required: true
      }
    },
    errorPlacement: function(error, element) {
      if (element.attr('type') === "checkbox") {
        const parent = element.parent()
        return parent.addClass('error')
      }
      element.addClass('error')
    },
    unhighlight: function(element) {
      el = $(element)
      if (el.attr('type') === "checkbox") {
        const parent = el.parent()
        return parent.removeClass('error')
      }
      el.removeClass('error')
    },
    submitHandler: function (form) {
      const data = $(form).serializeJSON()

      $.ajax({
        url: 'http://jsonplaceholder.typicode.com/posts',
        method: 'POST',
        crossDomain: true,
        data: data,
        dataType: 'json',
        success: function() {
          messageOverlay(formSucces)
          setTimeout(hideOverlay, 5000)
        },
        error: function() {
          messageOverlay(formError)
          setTimeout(hideOverlay, 5000)
        },
      })
    }
  })
})

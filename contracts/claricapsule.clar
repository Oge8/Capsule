;; Decentralized Time Capsule Network

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-already-exists (err u101))
(define-constant err-does-not-exist (err u102))
(define-constant err-not-authorized (err u103))
(define-constant err-capsule-locked (err u104))
(define-constant err-capsule-not-mature (err u105))

;; Data Variables
(define-data-var next-capsule-id uint u0)

;; Maps
(define-map time-capsules
  { capsule-id: uint }
  {
    owner: principal,
    content: (string-ascii 256),
    lock-height: uint,
    is-revealed: bool
  }
)

;; Private Functions
(define-private (is-contract-owner)
  (is-eq tx-sender contract-owner)
)

(define-private (capsule-exists (capsule-id uint))
  (default-to false (get is-revealed (map-get? time-capsules { capsule-id: capsule-id })))
)

;; Public Functions
(define-public (create-time-capsule (content (string-ascii 256)) (lock-duration uint))
  (let
    (
      (new-capsule-id (var-get next-capsule-id))
      (lock-height (+ block-height lock-duration))
    )
    (asserts! (is-some (string-ascii? content)) (err u106))
    (map-set time-capsules
      { capsule-id: new-capsule-id }
      {
        owner: tx-sender,
        content: content,
        lock-height: lock-height,
        is-revealed: false
      }
    )
    (var-set next-capsule-id (+ new-capsule-id u1))
    (ok new-capsule-id)
  )
)

(define-public (reveal-capsule (capsule-id uint))
  (let
    (
      (capsule (unwrap! (map-get? time-capsules { capsule-id: capsule-id }) err-does-not-exist))
      (owner (get owner capsule))
      (lock-height (get lock-height capsule))
      (is-revealed (get is-revealed capsule))
    )
    (asserts! (is-eq tx-sender owner) err-not-authorized)
    (asserts! (not is-revealed) err-capsule-locked)
    (asserts! (>= block-height lock-height) err-capsule-not-mature)
    (map-set time-capsules
      { capsule-id: capsule-id }
      (merge capsule { is-revealed: true })
    )
    (ok true)
  )
)

(define-read-only (get-capsule (capsule-id uint))
  (let
    (
      (capsule (unwrap! (map-get? time-capsules { capsule-id: capsule-id }) err-does-not-exist))
      (is-revealed (get is-revealed capsule))
    )
    (if is-revealed
      (ok capsule)
      (err err-capsule-locked)
    )
  )
)

(define-read-only (get-capsule-count)
  (ok (var-get next-capsule-id))
)
